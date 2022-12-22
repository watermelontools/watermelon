import executeRequest from "../azuredb";

export default async function getRefreshToken(email): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_bitbucket_refresh_token @email = '${email}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
