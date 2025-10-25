require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const recommendationRoutes = require('./routes/recommendations');
const recipeRoutes = require('./routes/recipes');
const actionRoutes = require('./routes/actions');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/actions', actionRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
