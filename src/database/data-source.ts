import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env',
});

export default new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
