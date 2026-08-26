const { verifyAccessToken } = require('../utils/generateToken');
const { error } = require('../utils/responseHelper');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return error(res, 'Authentication token required', 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired access token', 401);
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch (err) {
      // optional token verification failed, proceed as guest
    }
  }
  next();
};

authenticateToken.optionalAuth = optionalAuth;

module.exports = authenticateToken;
