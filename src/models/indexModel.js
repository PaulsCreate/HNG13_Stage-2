// Import necessary modules
const { Sequelize } = require('sequelize'); // Import Sequelize for ORM
const dotenv = require('dotenv'); // Import dotenv for environment variable management

// Load environment variables from the specified path
dotenv.config({ path: 'src/conf.env' });

/**
 * Initializes a new Sequelize instance to connect to the database.
 * Connection details are fetched from environment variables.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: process.env.DB_DIALECT, // Database dialect (e.g., 'postgres', 'mysql')
    logging: false, // Disable logging SQL queries to console
  }
);

/**
 * Authenticates the connection to the database.
 * Logs success or failure messages to the console.
 */
sequelize
  .authenticate()
  .then(() => console.log('✅ DB Connected successfully to MySQL Server')) // Log success message on successful connection
  .catch((err) => console.error('❌ DB Connection Failed:', err.message)); // Log error message on connection failure

module.exports = sequelize; // Export the initialized Sequelize instance
