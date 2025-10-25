require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
