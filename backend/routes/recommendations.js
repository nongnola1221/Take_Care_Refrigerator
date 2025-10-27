const express = require('express');
const authenticateToken = require('../middleware/auth');
const { TfIdf } = require('natural');
const { models } = require('../models');
const { Recipe, Ingredient, UserInventory } = models;
const { crawlRecipes, saveCrawledRecipe } = require('../utils/recipeCrawler');

const router = express.Router();

router.use(authenticateToken);

// Cosine similarity function for sparse vectors (represented as objects)
function cosineSimilarity(vecA, vecB) {
  const terms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const term of terms) {
    const valA = vecA[term] || 0;
    const valB = vecB[term] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper function to calculate missing ingredients and add storage tips
const processRecipeForUser = (recipe, userIngredients) => {
  const recipeIngredients = recipe.Ingredients.map(ing => ing.name);
  const missingIngredients = recipeIngredients.filter(ing => !userIngredients.includes(ing));
  const ingredientsWithTips = recipe.Ingredients.map(ing => ({
    name: ing.name,
    quantity: ing.RecipeIngredient.quantity,
    storage_tip: ing.storage_tip || '보관 팁 없음',
    has_in_inventory: userIngredients.includes(ing.name),
  }));

  return {
    ...recipe.toJSON(),
    missing_ingredients: missingIngredients,
    ingredients: ingredientsWithTips,
  };
};

// Existing recommendation endpoint (now also calculates missing ingredients and adds storage tips)
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { cuisine_type, serving_size, difficulty } = req.body; // Added difficulty filter

    const userInventoryItems = await UserInventory.findAll({
      where: { userId },
      include: Ingredient,
    });
    const userIngredients = userInventoryItems.map(item => item.Ingredient.name);

    const allRecipes = await Recipe.findAll({ include: Ingredient });

    const recommendations = [];
    for (const recipe of allRecipes) {
      const recipeIngredients = recipe.Ingredients.map(ing => ing.name);

      const tfidf = new TfIdf();
      tfidf.addDocument(userIngredients.join(' '));
      tfidf.addDocument(recipeIngredients.join(' '));

      const userVector = {};
      tfidf.listTerms(0).forEach(term => {
        userVector[term.term] = term.tfidf;
      });

      const recipeVector = {};
      tfidf.listTerms(1).forEach(term => {
        recipeVector[term.term] = term.tfidf;
      });

      const similarity = cosineSimilarity(userVector, recipeVector);

      if (similarity > 0) { // Include all recipes with some similarity
        recommendations.push({ recipe, score: similarity });
      }
    }

    recommendations.sort((a, b) => b.score - a.score);

    let filteredRecommendations = recommendations.map(r => r.recipe);

    if (cuisine_type) {
      filteredRecommendations = filteredRecommendations.filter(r => r.cuisine_type === cuisine_type);
    }
    if (serving_size) {
      filteredRecommendations = filteredRecommendations.filter(r => r.serving_size <= serving_size);
    }
    if (difficulty) { // Apply difficulty filter
      filteredRecommendations = filteredRecommendations.filter(r => r.difficulty === difficulty);
    }

    const finalRecommendations = filteredRecommendations.map(recipe => processRecipeForUser(recipe, userIngredients));

    res.json(finalRecommendations);

  } catch (error) {
    console.error('Error in POST /recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for on-demand crawling and recommendation
router.get('/crawl-and-recommend', async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchQuery, categoryFilter, cuisine_type, serving_size, difficulty } = req.query; // Use req.query for GET

    if (!searchQuery) {
      return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    // 1. Crawl recipes based on search query and category filter
    const crawledRecipesData = await crawlRecipes(searchQuery, categoryFilter);
    const savedRecipes = [];
    for (const recipeData of crawledRecipesData) {
      const savedRecipe = await saveCrawledRecipe(recipeData);
      if (savedRecipe) savedRecipes.push(savedRecipe);
    }

    // 2. Fetch user's inventory
    const userInventoryItems = await UserInventory.findAll({
      where: { userId },
      include: Ingredient,
    });
    const userIngredients = userInventoryItems.map(item => item.Ingredient.name);

    // 3. Fetch all recipes (including newly saved ones) for recommendation
    const allRecipes = await Recipe.findAll({ include: Ingredient });

    // 4. Calculate similarity and filter
    const recommendations = [];
    for (const recipe of allRecipes) {
      const recipeIngredients = recipe.Ingredients.map(ing => ing.name);

      const tfidf = new TfIdf();
      tfidf.addDocument(userIngredients.join(' '));
      tfidf.addDocument(recipeIngredients.join(' '));

      const userVector = {};
      tfidf.listTerms(0).forEach(term => {
        userVector[term.term] = term.tfidf;
      });

      const recipeVector = {};
      tfidf.listTerms(1).forEach(term => {
        recipeVector[term.term] = term.tfidf;
      });

      const similarity = cosineSimilarity(userVector, recipeVector);

      if (similarity > 0) { // Include all recipes with some similarity
        recommendations.push({ recipe, score: similarity });
      }
    }

    recommendations.sort((a, b) => b.score - a.score);

    let filteredRecommendations = recommendations.map(r => r.recipe);

    // Apply filters from query parameters
    if (cuisine_type) {
      filteredRecommendations = filteredRecommendations.filter(r => r.cuisine_type === cuisine_type);
    }
    if (serving_size) {
      filteredRecommendations = filteredRecommendations.filter(r => r.serving_size <= serving_size);
    }
    if (difficulty) {
      filteredRecommendations = filteredRecommendations.filter(r => r.difficulty === difficulty);
    }
    if (categoryFilter) { // Apply specific category filter
      filteredRecommendations = filteredRecommendations.filter(r => r.category === categoryFilter);
    }

    const finalRecommendations = filteredRecommendations.map(recipe => processRecipeForUser(recipe, userIngredients));

    res.json(finalRecommendations);

  } catch (error) {
    console.error('Error in GET /recommendations/crawl-and-recommend:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;