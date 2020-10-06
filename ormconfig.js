// @ts-check

require('dotenv').config();

/** @type {import('typeorm').ConnectionOptions} */
const ormConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: process.env.NODE_ENV === 'development',
  migrationsTableName: "migrations",
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  // @ts-ignore
  abortTransactionOnError: true,
};

module.exports = ormConfig;
