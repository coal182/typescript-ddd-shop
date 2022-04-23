export default {
  API_PORT: process.env.API_PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://user:123456@mongodb:27017/bookstore',
  DB_NAME: process.env.DB_NAME || 'bookstore',
  REDIS_URI: process.env.REDIS_URI || 'redis://tba-redis:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'tba-redis',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
};
