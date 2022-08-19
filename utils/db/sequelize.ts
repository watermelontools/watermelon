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
    dialectOptions: {
      encrypt: true,
    },
    schema: "watermelon.dbo",
  }
);
export default sequelize;
