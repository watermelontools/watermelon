import executeRequest from "../azuredb";

export default async function intellijLogin({ watermelon_user }): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_user_email_from_id @watermelon_user = '${watermelon_user}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
