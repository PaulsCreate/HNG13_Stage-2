// Import necessary modules
const express = require('express'); // Import the Express.js framework
const dotenv = require('dotenv'); // Import dotenv for environment variable management
const countryRoutes = require('./src/route/countryRoutes');
const sequelize = require('./src/models/indexModel'); // Import country routes
const errorHandler = require('./src/middleware/errorHandler'); // Import error handling middleware

// Load environment variables from the specified path
dotenv.config({ path: './src/conf.env' });

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mount country routes under the '/country' path
app.use('/country', countryRoutes);

// Define a simple root route
app.get('/', (req, res) => {
  res.send('Hello, World!'); // Send a greeting message
});

// Define a test route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Tested Successful' }); // Respond with a success message
});

sequelize
  .sync({ alter: true }) // <- ensures table is created or updated
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ Failed to sync DB:', err.message);
  });

// Global error handling middleware
app.use(errorHandler);
