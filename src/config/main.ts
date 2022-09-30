export default {
  API_PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://user:123456@mongodb:27017/bookstore',
  DB_NAME: process.env.DB_NAME || 'bookstore',
  REDIS_HOST: process.env.REDIS_HOST || 'tba-redis',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'DZMxGqSdhQpEzKu9XSpH0QzhsnzEocXR',
  JWT_SECRET: process.env.JWT_SECRET || '123456',
};
