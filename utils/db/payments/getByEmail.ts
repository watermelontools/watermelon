import executeRequest from "../azuredb";

export default async function getByEmail({
  email,
}: {
  email: string;
}): Promise<boolean> {
  try {
    let query = `EXEC dbo.get_payment_by_email @email='${email}'`;
    let resp = await executeRequest(query);
    console.log("resp", resp);
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
}
