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

// Main recommendation endpoint with crawling fallback
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { cuisine_type, serving_size, difficulty, searchQuery, categoryFilter } = req.body; // Added searchQuery, categoryFilter

    const userInventoryItems = await UserInventory.findAll({
      where: { userId },
      include: Ingredient,
    });
    const userIngredients = userInventoryItems.map(item => item.Ingredient.name);

    let allRecipes = await Recipe.findAll({ include: Ingredient });
    let finalRecommendations = [];

    // --- Recommendation Logic --- //
    const runRecommendationLogic = (recipesToProcess) => {
      const recommendations = [];
      for (const recipe of recipesToProcess) {
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

      let filtered = recommendations.map(r => r.recipe);

      if (cuisine_type) {
        filtered = filtered.filter(r => r.cuisine_type === cuisine_type);
      }
      if (serving_size) {
        filtered = filtered.filter(r => r.serving_size <= serving_size);
      }
      if (difficulty) {
        filtered = filtered.filter(r => r.difficulty === difficulty);
      }
      if (categoryFilter) { // Apply specific category filter
        filtered = filtered.filter(r => r.category === categoryFilter);
      }
      return filtered.map(recipe => processRecipeForUser(recipe, userIngredients));
    };

    // 1. Run initial recommendation on existing DB recipes
    finalRecommendations = runRecommendationLogic(allRecipes);

    // 2. If no recommendations found and searchQuery is provided, trigger crawling
    if (finalRecommendations.length === 0 && searchQuery) {
      console.log(`No local recipes found for query "${searchQuery}". Initiating crawl...`);
      const crawledRecipesData = await crawlRecipes(searchQuery, categoryFilter);
      const savedRecipes = [];
      for (const recipeData of crawledRecipesData) {
        const savedRecipe = await saveCrawledRecipe(recipeData);
        if (savedRecipe) savedRecipes.push(savedRecipe);
      }

      // Re-fetch all recipes to include newly crawled ones
      allRecipes = await Recipe.findAll({ include: Ingredient });
      finalRecommendations = runRecommendationLogic(allRecipes);
    }

    res.json(finalRecommendations);

  } catch (error) {
    console.error('Error in POST /recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;