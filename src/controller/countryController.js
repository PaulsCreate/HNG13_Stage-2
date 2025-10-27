// Import necessary modules
const axios = require('axios'); // For making HTTP requests to external APIs
const fs = require('fs'); // For file system operations
const path = require('path'); // For working with file and directory paths
const Country = require('../models/countryModel'); // Import the Country model
const { generateSummaryImage } = require('../utils/imageGenerator'); // Import image generation utility

// External API URLs
const REFRESH_URL = process.env.COUNTRIES_API; // URL to fetch country data
const EXCHANGE_URL = process.env.EXCHANGE_API; // URL to fetch exchange rates

/**
 * Refreshes country data from external APIs and updates the database.
 * Also generates a summary image.
 */
exports.refreshCountries = async (req, res) => {
  try {
    const [countriesRes, ratesRes] = await Promise.all([
      axios.get(REFRESH_URL),
      axios.get(EXCHANGE_URL),
    ]);

    const countries = countriesRes.data;
    const rates = ratesRes.data?.rates || {};
    const now = new Date();

    // Build data payloads first
    const payloads = countries.map((c) => {
      const currency = c.currencies?.[0]?.code || null;
      const exchange_rate =
        currency && rates[currency] ? rates[currency] : null;
      const multiplier = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
      const estimated_gdp = exchange_rate
        ? (c.population * multiplier) / exchange_rate
        : 0;

      return {
        name: c.name,
        capital: c.capital,
        region: c.region,
        population: c.population,
        currency_code: currency,
        exchange_rate,
        estimated_gdp,
        flag_url: c.flag,
        last_refreshed_at: now,
      };
    });

    // Bulk insert/update
    await Promise.all(
      payloads.map(async (data) => {
        const existing = await Country.findOne({ where: { name: data.name } });
        if (existing)
          await Country.update(data, { where: { name: data.name } });
        else await Country.create(data);
      })
    );

    // ✅ Send response first
    res.json({
      message: '✅ Countries refreshed successfully',
      total: payloads.length,
      last_refreshed_at: now,
    });

    // 🖼️ Generate summary image in background (non-blocking)
    generateSummaryImage(now).catch((err) =>
      console.error('Image generation failed:', err.message)
    );
  } catch (err) {
    console.error('Error:', err.message);
    res
      .status(503)
      .json({
        error: 'External data source unavailable',
        details: err.message,
      });
  }
};

/**
 * Lists countries based on provided filters (region, currency) and sorting options.
 */
exports.listCountries = async (req, res) => {
  try {
    const { region, currency, sort } = req.query; // Extract query parameters
    const where = {}; // Initialize an empty where clause for filtering

    // Add filters if provided
    if (region) where.region = region;
    if (currency) where.currency_code = currency;

    let order = []; // Initialize an empty array for sorting
    // Add sorting based on 'sort' query parameter
    if (sort === 'gdp_desc') order = [['estimated_gdp', 'DESC']];
    else if (sort === 'gdp_asc') order = [['estimated_gdp', 'ASC']];

    // Find all countries matching the criteria
    const countries = await Country.findAll({ where, order });
    res.json(countries); // Send the list of countries as response
  } catch (err) {
    // Log error and send internal server error response
    console.error(err.message); // Added console.error for better debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieves a single country by its name.
 */
exports.getCountry = async (req, res) => {
  const { name } = req.params; // Extract country name from request parameters
  const country = await Country.findOne({ where: { name } }); // Find country by name
  if (!country) {
    // If country not found, send 404 response
    return res.status(404).json({ error: 'Country not found' });
  }
  res.json(country); // Send the found country as response
};

/**
 * Deletes a country by its name.
 */
exports.deleteCountry = async (req, res) => {
  const { name } = req.params; // Extract country name from request parameters
  const deleted = await Country.destroy({ where: { name } }); // Delete country by name
  if (!deleted) {
    // If no country was deleted, send 404 response
    return res.status(404).json({ error: 'Country not found' });
  }
  res.json({ message: 'Country deleted' }); // Send success message
};

/**
 * Retrieves the status of the country data, including total count and last refresh time.
 */
exports.status = async (req, res) => {
  const total = await Country.count(); // Get total count of countries
  const latest = await Country.findOne({
    order: [['last_refreshed_at', 'DESC']], // Find the latest refreshed country
  });
  res.json({
    total_countries: total,
    last_refreshed_at: latest ? latest.last_refreshed_at : null, // Send total count and last refreshed time
  });
};

/**
 * Serves the summary image.
 */
exports.getImage = async (req, res) => {
  const imgPath = path.join(__dirname, '../cache/summary.png'); // Construct path to the summary image
  if (!fs.existsSync(imgPath)) {
    // If image not found, send 404 response
    return res.status(404).json({ error: 'Summary image not found' });
  }
  res.sendFile(imgPath); // Send the image file
};
