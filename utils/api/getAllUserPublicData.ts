import "server-only";
import getAllPublicUserData from "../db/user/getAllPublicUserData";
export default async function getData({ email }) {
  let dbUser = await getAllPublicUserData({ email });
  return dbUser;
}
