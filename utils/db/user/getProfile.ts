import { supabase } from "../../supabase";
import { UserProfile } from "../../../types/UserProfile";
const { Request, Connection } = require("tedious");
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
  return connection;
};
export default async function getUserProfile(
  userId: string
): Promise<UserProfile> {
  let userProfile = {
    userId,
    name: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    createdAt: "",
    updatedAt: "",
    website: "",
    profileImage: "",
    company: "",
    isAdmin: false,
  };
  let connection = await getConnection();
  console.log("connection: ");
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected");
      queryDatabase();
    }
  });

  connection.connect();

  function queryDatabase() {
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
      `SELECT *
       FROM [dbo].[profiles]`,
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
    console.log("request: ");
    request.on("row", (columns) => {
      columns.forEach((column) => {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });
    connection.execSql(request);
    console.log("executed");
  }
  let { data, error, status } = await supabase
    .from("profiles")
    .select(`username, website, avatar_url`)
    .eq("id", userId)
    .single();

  if (error && status !== 406) {
    throw error;
  }
  if (data) {
    userProfile = {
      userId,
      name: "",
      username: data.username,
      lastName: "",
      email: "",
      phone: "",
      createdAt: "",
      updatedAt: "",
      website: data.website,
      profileImage: data.avatar_url,
      company: "",
      isAdmin: false,
    };
    return userProfile;
  }
}
