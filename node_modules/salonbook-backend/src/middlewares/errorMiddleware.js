const { error } = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err.message || err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  return error(res, message, statusCode);
};

module.exports = errorHandler;
