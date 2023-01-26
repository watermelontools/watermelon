import executeRequest from "../azuredb";

export default async function getToken({ user }): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_slack_token @watermelon_user = '${user}'`
    );
console.log("data", data)
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
