const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.AZURE_DATABASE_DBNAME,
  process.env.AZURE_DATABASE_USERNAME,
  process.env.AZURE_DATABASE_PASSWORD,
  {
    host: process.env.AZURE_DATABASE_HOST,
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    dialectOptions: {
      encrypt: true,
    },
  }
);
export default sequelize;
