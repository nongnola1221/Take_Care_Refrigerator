const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { sequelize, models } = require('./models');
const { Recipe, Ingredient, RecipeIngredient, User, UserInventory } = models;
const bcrypt = require('bcrypt');

// Helper function to parse the string representation of a list
const parseIngredientList = (str) => {
  try {
    // Replace single quotes with double quotes for valid JSON
    const jsonString = str.replace(/'/g, '"');
    const arr = JSON.parse(jsonString);
    return arr;
  } catch (e) {
    console.error('Failed to parse ingredient string:', str);
    return [];
  }
};

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // 1. Read and parse the CSV file
    const csvFilePath = '/Users/nongnola/Documents/프로젝트/Take_Care_Refrigerator/frontend/src/assets/recipe_main_preprocessing_example.csv';
    const fileContent = fs.readFileSync(csvFilePath);
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    console.log(`Found ${records.length} recipes in CSV. Seeding...`);

    // 2. Iterate over records and populate database
    for (const record of records) {
      // Create Recipe
      const newRecipe = await Recipe.create({
        name: record.제목,
        instructions: record.조리순서, // Assuming this is a text field
        cuisine_type: record.종류별,
        serving_size: parseInt(record.인분, 10) || null,
      });

      // Find or Create Ingredients and link them
      const ingredients = parseIngredientList(record.재료);
      for (const ingredientName of ingredients) {
        if (ingredientName) {
          const [ingredient] = await Ingredient.findOrCreate({
            where: { name: ingredientName.trim() },
          });
          await newRecipe.addIngredient(ingredient, { through: { quantity: '' } });
        }
      }
    }

    console.log('Finished seeding recipes and ingredients.');

    // 3. Create Admin User
    console.log('Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('admin', 10);
    const adminUser = await User.create({ email: 'admin@admin', password_hash: adminPasswordHash });

    // 4. Populate Admin Inventory with ingredients from the CSV
    console.log('Populating admin inventory...');
    const tofu = await Ingredient.findOne({ where: { name: '두부' } });
    const mincedBeef = await Ingredient.findOne({ where: { name: '다진소고기' } });

    if (adminUser && tofu && mincedBeef) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      await UserInventory.create({ userId: adminUser.id, ingredientId: tofu.id, quantity: '1모', expiry_date: expiryDate });
      await UserInventory.create({ userId: adminUser.id, ingredientId: mincedBeef.id, quantity: '200g', expiry_date: expiryDate });
    }

    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
