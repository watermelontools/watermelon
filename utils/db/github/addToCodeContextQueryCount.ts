import executeRequest from "../azuredb";

export default async function addToCodeContextQueryCounter(userEmail): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.add_to_query_count @email = '${userEmail}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}