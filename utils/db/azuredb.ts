const { Connection } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: process.env.AZURE_DATABASE_USERNAME, // update me
      password: process.env.AZURE_DATABASE_PASSWORD, // update me
    },
    type: "default",
  },
  server: process.env.AZURE_DATABASE_SERVER, // update me
  options: {
    database: process.env.AZURE_DATABASE_DBNAME, //update me
    encrypt: true,
  },
};

let connection = new Connection(config);
const getConnection = async () => {
  if (connection) return connection;
  connection = new Connection(config);
};
export default getConnection;
