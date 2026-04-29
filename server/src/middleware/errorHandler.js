// Global error handler middleware
function errorHandler(err, req, res, next) {
  console.error(`[Nyvara API Error] ${err.message}`);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error:   err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
