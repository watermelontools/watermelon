import "server-only";
import executeRequest from "../azuredb";

export default async function getAllPublicUserData({ email }): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_user_all_public_data @watermelon_user = '${email}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err; // This will cause the promise to be rejected with the error
  }
}
