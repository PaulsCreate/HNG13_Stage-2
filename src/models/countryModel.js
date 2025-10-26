// Import necessary modules from Sequelize
const { DataTypes } = require("sequelize");
const sequelize = require("./indexModel"); // Import the Sequelize instance

/**
 * Defines the Country model.
 * This model represents countries and their associated data in the database.
 */
const Country = sequelize.define("Country", {
  // Unique name of the country, cannot be null
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  capital: DataTypes.STRING, // Capital city of the country
  region: DataTypes.STRING, // Region where the country is located
  // Population of the country, cannot be null
  population: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  currency_code: DataTypes.STRING, // ISO currency code
  exchange_rate: DataTypes.FLOAT, // Exchange rate against a base currency (e.g., USD)
  estimated_gdp: DataTypes.FLOAT, // Estimated Gross Domestic Product
  flag_url: DataTypes.STRING, // URL to the country's flag image
  last_refreshed_at: DataTypes.DATE // Timestamp of the last data refresh
}, {
  // Enable timestamps (createdAt, updatedAt)
  timestamps: true,
  // Set the table name in the database
  tableName: "countries"
});

module.exports = Country; // Export the Country model
