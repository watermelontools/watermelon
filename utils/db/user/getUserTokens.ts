import executeRequest from "../azuredb";

export default async function getUserTokens({ email }): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_all_user_tokens @watermelon_user = '${email}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
