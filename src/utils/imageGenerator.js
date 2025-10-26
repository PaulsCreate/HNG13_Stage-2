const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const Country = require('../models/countryModel'); // Import the Country model

exports.generateSummaryImage = async (timestamp) => {
  console.log(`Generating summary image for ${timestamp}`);

  // Ensure the cache directory exists
  const cacheDir = path.join(__dirname, '../cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  // Fetch data for the image
  const totalCountries = await Country.count();
  const latestRefresh = await Country.findOne({
    order: [['last_refreshed_at', 'DESC']],
  });

  // Create a canvas
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Fill background
  context.fillStyle = '#f0f0f0';
  context.fillRect(0, 0, width, height);

  // Set text properties
  context.font = '30px Arial';
  context.fillStyle = '#333333';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Draw text
  context.fillText('Country Data Summary', width / 2, height / 4);
  context.font = '20px Arial';
  context.fillText(`Total Countries: ${totalCountries}`, width / 2, height / 2);
  context.fillText(
    `Last Refreshed: ${latestRefresh ? latestRefresh.last_refreshed_at.toLocaleString() : 'N/A'}`,
    width / 2,
    height / 2 + 40
  );

  // Save the image
  const outputPath = path.join(cacheDir, 'summary.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`Summary image generated at ${outputPath}`);
  return Promise.resolve();
};
