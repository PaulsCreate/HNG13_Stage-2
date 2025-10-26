/**
 * Global error handling middleware.
 * Catches errors from routes and sends a standardized error response.
 * @param {Error} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging purposes
  // Send an error response with appropriate status code and message
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
};
