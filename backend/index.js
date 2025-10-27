require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const recommendationRoutes = require('./routes/recommendations');
const recipeRoutes = require('./routes/recipes');
const actionRoutes = require('./routes/actions');
const ingredientsRoutes = require('./routes/ingredients');

const app = express();
app.use(cors({ origin: 'https://nongnola1221.github.io' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/ingredients', ingredientsRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
