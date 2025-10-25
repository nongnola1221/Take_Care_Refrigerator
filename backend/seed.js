const { sequelize, models } = require('./models');
const { Recipe, Ingredient, RecipeIngredient } = models;

const ingredientsData = [
  { name: '김치', storage_tip: '냉장 보관하세요.' },
  { name: '돼지고기', storage_tip: '냉동 또는 냉장 보관하세요.' },
  { name: '두부', storage_tip: '물에 담가 냉장 보관하세요.' },
  { name: '양파', storage_tip: '서늘하고 건조한 곳에 보관하세요.' },
  { name: '계란', storage_tip: '냉장 보관하세요.' },
  { name: '밥', storage_tip: '남은 밥은 냉동 보관하는 것이 좋습니다.' },
  { name: '스팸', storage_tip: '개봉 후에는 냉장 보관하세요.' },
  { name: '대파', storage_tip: '뿌리 부분을 물에 적신 키친타올로 감싸 냉장 보관하세요.' },
];

const recipesData = [
  {
    name: '김치찌개',
    instructions: '1. 돼지고기를 볶는다. 2. 김치를 넣고 더 볶는다. 3. 물을 붓고 끓인다. 4. 두부와 대파를 넣고 마무리한다.',
    cuisine_type: '한식',
    serving_size: 2,
    ingredients: [
      { name: '김치', quantity: '1/4포기' },
      { name: '돼지고기', quantity: '200g' },
      { name: '두부', quantity: '1/2모' },
      { name: '대파', quantity: '1/2대' },
    ],
  },
  {
    name: '계란볶음밥',
    instructions: '1. 파기름을 낸다. 2. 계란을 스크램블한다. 3. 밥을 넣고 볶는다. 4. 간장으로 간을 맞춘다.',
    cuisine_type: '한식',
    serving_size: 1,
    ingredients: [
      { name: '밥', quantity: '1공기' },
      { name: '계란', quantity: '2개' },
      { name: '대파', quantity: '1/4대' },
    ],
  },
  {
    name: '스팸김치볶음밥',
    instructions: '1. 스팸과 김치를 볶는다. 2. 밥을 넣고 함께 볶는다. 3. 계란 후라이를 올려 마무리한다.',
    cuisine_type: '한식',
    serving_size: 1,
    ingredients: [
      { name: '스팸', quantity: '1/2캔' },
      { name: '김치', quantity: '1종이컵' },
      { name: '밥', quantity: '1공기' },
      { name: '계란', quantity: '1개' },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop tables and re-create them

    console.log('Seeding ingredients...');
    const ingredients = await Ingredient.bulkCreate(ingredientsData, { returning: true });

    console.log('Seeding recipes...');
    for (const recipeData of recipesData) {
      const recipe = await Recipe.create({
        name: recipeData.name,
        instructions: recipeData.instructions,
        cuisine_type: recipeData.cuisine_type,
        serving_size: recipeData.serving_size,
      });

      for (const recipeIngredientData of recipeData.ingredients) {
        const ingredient = ingredients.find(i => i.name === recipeIngredientData.name);
        if (ingredient) {
          await recipe.addIngredient(ingredient, { through: { quantity: recipeIngredientData.quantity } });
        }
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
