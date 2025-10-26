// Import necessary modules
const express = require("express"); // Import the Express.js framework
const countryController = require("../controller/countryController"); // Import country controller functions

// Create an Express router instance
const router = express.Router();

// Define country routes and link them to controller functions

// POST request to refresh country data from external APIs
router.post("/refresh", countryController.refreshCountries);

// GET request to list all countries with optional filters
router.get("/", countryController.listCountries);

// GET request to retrieve the status of country data (total count, last refreshed time)
router.get("/status", countryController.status);

// GET request to retrieve the summary image
router.get("/image", countryController.getImage);

// GET request to retrieve a single country by its name
router.get("/:name", countryController.getCountry);

// DELETE request to delete a country by its name
router.delete("/:name", countryController.deleteCountry);

module.exports = router; // Export the router