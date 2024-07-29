require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { Pool } = require("pg");

module.exports = new Pool({
  host: `${process.env.CUSTOM_HOST}`,
  user: `${process.env.USER_ROLE}`,
  database: `${process.env.DB_NAME}`,
  password: `${process.env.PASSWORD}`,
  port: process.env.CUSTOM_PORT,
});
