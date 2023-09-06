import "server-only";
import getAllPublicUserData from "../db/user/getAllPublicUserData";
export default async function getData({ userEmail }) {
  let dbUser = await getAllPublicUserData({ email: userEmail });
  return dbUser;
}
