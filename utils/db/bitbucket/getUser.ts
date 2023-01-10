import executeRequest from "../azuredb";

export default async function getUser(email): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_bitbucket_user @watermelon_user = '${email}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
