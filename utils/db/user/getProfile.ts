import { supabase } from "../../supabase";
import connection from "../azuredb";
import { UserProfile } from "../../../types/UserProfile";
const { Request } = require("tedious");

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

  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
    } else {
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

    request.on("row", (columns) => {
      columns.forEach((column) => {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });

    connection.execSql(request);
    connection.close();
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
