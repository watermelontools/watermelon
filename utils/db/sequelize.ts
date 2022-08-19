const Sequelize = require("sequelize");
import * as tedious from "tedious";
const sequelize = new Sequelize(
  process.env.AZURE_DATABASE_DBNAME,
  process.env.AZURE_DATABASE_USERNAME,
  process.env.AZURE_DATABASE_PASSWORD,
  {
    host: process.env.AZURE_DATABASE_HOST,
    dialectModule: tedious,
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    port: 1433,
    dialectOptions: {
      encrypt: true,
      userName: process.env.AZURE_DATABASE_USERNAME,
      password: process.env.AZURE_DATABASE_PASSWORD,
    },
    schema: "[dbo]",
  }
);
export default sequelize;
