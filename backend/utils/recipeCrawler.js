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

    const name = $('div.view2_summary > h3').text().trim();
    const imageUrl = $('div.centeredcrop > img').attr('src');
    console.log(`Extracted Image URL: ${imageUrl}`);
    const instructions = [];
    $('div.view_step_cont > div.view_step_cont_text').each((i, el) => {
      const stepText = $(el).text().trim();
      if (stepText) instructions.push(`${i + 1}. ${stepText.replace(/\n/g, ' ').trim()}`); // Clean up newlines
    });

    const ingredients = [];
    $('div.ready_ingre3 ul li').each((i, el) => {
      const ingreName = $(el).find('a').text().trim();
      const ingreQty = $(el).find('span.cnt').text().trim();
      if (ingreName) ingredients.push({ name: ingreName, quantity: ingreQty });
    });

    // Extract difficulty, cooking time, serving size
    let difficulty = 0; // Default
    let cookingTime = '';
    let servingSize = '';

    $('div.view2_summary_info li').each((i, el) => {
      const label = $(el).find('span.icon_tag').text().trim();
      const value = $(el).find('span.view2_summary_info2').text().trim();
      if (label === '난이도') {
        if (value.includes('초급')) difficulty = 1;
        else if (value.includes('중급')) difficulty = 2;
        else if (value.includes('고급')) difficulty = 3;
      } else if (label === '시간') {
        cookingTime = value;
      } else if (label === '인원') {
        servingSize = value;
      }
    });

    // Extract categories (use the first few relevant tags)
    let cuisineTypeText = '';
    const categoryTags = [];
    $('div.view_tag a').each((i, el) => {
      const tagText = $(el).text().trim();
      if (tagText && tagText.length < 10) { // Avoid overly long tags like full descriptions
        categoryTags.push(tagText);
      }
    });
    // Try to derive cuisine_type from the first few tags, or use a general one
    if (categoryTags.length > 0) {
        cuisineTypeText = categoryTags[0]; // Use the first tag as a primary classifier
    }
    const { cuisine_type, category } = mapCategory(cuisineTypeText || '기타');

    return {
      name,
      original_url: recipeUrl,
      image_url: imageUrl,
      instructions: instructions.join('\n'),
      ingredients, // Array of { name, quantity }
      difficulty,
      cooking_time: cookingTime,
      serving_size: servingSize.replace('인분', '').trim(), // Remove "인분" text
      cuisine_type,
      category: categoryTags.join(', ') || category, // Store all relevant tags, or the primary mapped category
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
    console.log(`Crawling search URL: ${searchUrl}`);

    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);
    console.log(`Fetched search page HTML for query: ${searchQuery}`);

    const recipeLinks = [];
    $('.common_sp_list_ul li').each((i, el) => {
      const link = $(el).find('.common_sp_link').attr('href');
      if (link && !recipeLinks.includes(link)) { // Avoid duplicates
        recipeLinks.push(MANGNA_RECIPE_BASE_URL + link);
      }
    });
    console.log(`Found ${recipeLinks.length} recipe links on search page.`);

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
