import executeRequest from "../azuredb";

export default async function getUser(user): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_user_all_public_data @watermelon_user = '${user}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
