require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'salonbook_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'yourpassword',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'salonbook_secret_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'salonbook_refresh_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  payhere: {
    merchantId: process.env.PAYHERE_MERCHANT_ID,
    secret: process.env.PAYHERE_SECRET,
  },
  storagePath: process.env.STORAGE_PATH || './uploads',
};
