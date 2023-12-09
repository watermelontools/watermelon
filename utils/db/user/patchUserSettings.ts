import executeRequest from "../azuredb";

export default async function updateUserSettings({
  email,
  userSettings,
}): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.update_userSettings @watermelon_user = '${email}', @AISummary='${
        userSettings.AISummary
      }', 
      @AdditionalSettings='${JSON.stringify(
        userSettings.AdditionalSettings
      )}', @Badges='${userSettings.Badges}', @CodeComments='${
        userSettings.CodeComments
      }'`
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
