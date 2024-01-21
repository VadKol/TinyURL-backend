import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  mongodb_username: process.env.MONGODB_USERNAME,
  mongodb_password: process.env.MONGODB_PASSWORD,
  mongodb_misc: process.env.MONGODB_MISC,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  redis_password: process.env.REDIS_PASSWORD
}
