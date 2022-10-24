import executeRequest from "../azuredb";

export default async function addEmails({
  email,
}: {
  email: string;
}): Promise<boolean> {
  try {
    let query = `EXEC dbo.add_emails_to_paying_user_list @email='${email}'`;
    let resp = await executeRequest(query);
    console.log("resp", resp);
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
}
