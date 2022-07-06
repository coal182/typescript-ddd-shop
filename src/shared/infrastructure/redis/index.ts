import RedisClient, { Redis } from 'ioredis';

export const getRedisClient = (port: number, host: string, password: string): Redis => {
  return new RedisClient(port, host, { password });
  //return new RedisClient(port, host);
};
