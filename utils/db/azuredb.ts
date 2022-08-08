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

const executeRequest = async (request) => {
  console.log("connection: ");

  await connection.connect((err) => {
    console.log("connected");
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected");
      request.on("row", (columns) => {
        columns.forEach((column) => {
          console.log("%s\t%s", column.metadata.colName, column.value);
        });
      });
      connection.execSql(request);
    }
  });
};
export default executeRequest;
