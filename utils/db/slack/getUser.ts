import executeRequest from "../azuredb";

export default async function getUser(user): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_slack_user @watermelon_user = '${user}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
