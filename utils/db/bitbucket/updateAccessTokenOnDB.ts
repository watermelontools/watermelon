import executeRequest from "../azuredb";

export default async function updateAccessTokenOnDB(
  email,
  newAccessToken
): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.update_bitbucket_access_token @email = '${email}', @new_access_token=${newAccessToken}`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
