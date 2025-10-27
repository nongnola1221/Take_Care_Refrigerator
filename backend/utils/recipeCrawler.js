const axios = require('axios');
const cheerio = require('cheerio');
const { Recipe, Ingredient, RecipeIngredient } = require('../models');
const { Op } = require('sequelize');

const MANGNA_RECIPE_BASE_URL = 'https://www.10000recipe.com';

// Helper to map 만개의레시피 categories to our cuisine_type/category
const mapCategory = (mangnaCategory) => {
  // This mapping will need to be refined based on actual categories from 만개의레시피
  if (mangnaCategory.includes('밑반찬')) return { cuisine_type: '한식', category: '밑반찬' };
  if (mangnaCategory.includes('메인반찬')) return { cuisine_type: '한식', category: '메인반찬' };
  if (mangnaCategory.includes('국/탕')) return { cuisine_type: '한식', category: '국/탕' };
  if (mangnaCategory.includes('찌개')) return { cuisine_type: '한식', category: '찌개' };
  if (mangnaCategory.includes('디저트')) return { cuisine_type: '기타', category: '디저트' };
  if (mangnaCategory.includes('면/만두')) return { cuisine_type: '한식', category: '면/만두' };
  if (mangnaCategory.includes('밥/죽/떡')) return { cuisine_type: '한식', category: '밥/죽/떡' };
  if (mangnaCategory.includes('퓨전')) return { cuisine_type: '퓨전', category: '퓨전' };
  if (mangnaCategory.includes('양념/잼/소스')) return { cuisine_type: '기타', category: '양념/잼/소스' };
  if (mangnaCategory.includes('양식')) return { cuisine_type: '양식', category: '양식' };
  if (mangnaCategory.includes('샐러드')) return { cuisine_type: '양식', category: '샐러드' };
  if (mangnaCategory.includes('스프')) return { cuisine_type: '양식', category: '스프' };
  if (mangnaCategory.includes('빵')) return { cuisine_type: '기타', category: '빵' };
  if (mangnaCategory.includes('과자')) return { cuisine_type: '기타', category: '과자' };
  if (mangnaCategory.includes('차/음료/술')) return { cuisine_type: '기타', category: '차/음료/술' };
  return { cuisine_type: '기타', category: mangnaCategory }; // Default or unknown category
};

// Function to crawl a single recipe's details
const crawlRecipeDetails = async (recipeUrl) => {
  try {
    const { data } = await axios.get(recipeUrl);
    const $ = cheerio.load(data);

    const name = $('.view_title h3').text().trim();
    const imageUrl = $('.view_step img').first().attr('src'); // Assuming first image in steps is main
    const instructions = [];
    $('.view_step_cont.media').each((i, el) => {
      const stepText = $(el).find('.view_step_cont_text').text().trim();
      if (stepText) instructions.push(`${i + 1}. ${stepText}`);
    });

    const ingredients = [];
    $('.ready_ingre3 ul li').each((i, el) => {
      const ingreName = $(el).find('a').text().trim();
      const ingreQty = $(el).find('span').text().trim();
      if (ingreName) ingredients.push({ name: ingreName, quantity: ingreQty });
    });

    const difficultyText = $('.view_info li:contains("난이도") .view_info_data').text().trim();
    let difficulty = 0; // Default to 0
    if (difficultyText.includes('초급')) difficulty = 1;
    else if (difficultyText.includes('중급')) difficulty = 2;
    else if (difficultyText.includes('고급')) difficulty = 3;

    const cookingTime = $('.view_info li:contains("시간") .view_info_data').text().trim();
    const servingSize = $('.view_info li:contains("인분") .view_info_data').text().trim();
    const cuisineTypeText = $('.view_tag a').first().text().trim(); // Assuming first tag is main category
    const { cuisine_type, category } = mapCategory(cuisineTypeText);

    return {
      name,
      original_url: recipeUrl,
      image_url: imageUrl,
      instructions: instructions.join('\n'),
      ingredients, // Array of { name, quantity }
      difficulty,
      cooking_time: cookingTime,
      serving_size: servingSize,
      cuisine_type,
      category,
      source: '만개의레시피',
    };
  } catch (error) {
    console.error(`Error crawling recipe details from ${recipeUrl}:`, error.message);
    return null;
  }
};

// Function to crawl recipes based on search query and category filter
const crawlRecipes = async (searchQuery, categoryFilter) => {
  try {
    let searchUrl = `${MANGNA_RECIPE_BASE_URL}/recipe/list.html?q=${encodeURIComponent(searchQuery)}`;
    // 만개의레시피는 카테고리 필터링을 URL 파라미터로 직접 지원하지 않을 수 있습니다.
    // 이 부분은 실제 사이트 구조에 따라 조정이 필요합니다.
    // 현재는 검색어에 카테고리를 포함하거나, 검색 후 필터링하는 방식으로 가정합니다.

    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);

    const recipeLinks = [];
    $('.common_sp_list_ul li').each((i, el) => {
      const link = $(el).find('.common_sp_link').attr('href');
      if (link && !recipeLinks.includes(link)) { // Avoid duplicates
        recipeLinks.push(MANGNA_RECIPE_BASE_URL + link);
      }
    });

    const crawledRecipes = [];
    for (const link of recipeLinks) {
      const recipeData = await crawlRecipeDetails(link);
      if (recipeData) {
        // Apply category filter after crawling if not possible via URL
        if (categoryFilter && recipeData.category !== categoryFilter) {
          continue; // Skip if category doesn't match
        }
        crawledRecipes.push(recipeData);
      }
    }
    return crawledRecipes;
  } catch (error) {
    console.error(`Error crawling recipes for query "${searchQuery}" and filter "${categoryFilter}":`, error.message);
    return [];
  }
};

// Function to save crawled recipe data to the database
const saveCrawledRecipe = async (recipeData) => {
  try {
    // Check if recipe already exists by original_url
    let recipe = await Recipe.findOne({ where: { original_url: recipeData.original_url } });

    if (recipe) {
      // Update existing recipe
      await recipe.update(recipeData);
    } else {
      // Create new recipe
      recipe = await Recipe.create(recipeData);
    }

    // Handle ingredients
    for (const ingre of recipeData.ingredients) {
      let ingredient = await Ingredient.findOne({ where: { name: ingre.name } });
      if (!ingredient) {
        ingredient = await Ingredient.create({ name: ingre.name }); // storage_tip will be null initially
      }
      // Link ingredient to recipe
      await RecipeIngredient.findOrCreate({
        where: { recipeId: recipe.id, ingredientId: ingredient.id },
        defaults: { quantity: ingre.quantity },
      });
    }
    return recipe;
  } catch (error) {
    console.error(`Error saving crawled recipe "${recipeData.name}":`, error.message);
    return null;
  }
};

module.exports = {
  crawlRecipes,
  saveCrawledRecipe,
  crawlRecipeDetails // Export for potential direct use or testing
};
