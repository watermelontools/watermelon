import { Organization } from "../../../types/jira/Organization";
import executeRequest from "../azuredb";

export default async function getJiraOrganization(user): Promise<Organization> {
  let organization: Organization = {
    id: "",
    name: "",
    description: "",
    url: "",
    avatarUrl: "",
    createdAt: "",
    updatedAt: "",
    organizationType: "",
    hasPaidPlan: false,
    access_token: "",
    refresh_token: "",
    scopes: [],
  };
  let azureData = await executeRequest(
    `SELECT * FROM dbo.jira WHERE id = '${user}' FOR JSON PATH      `
  );
  if (azureData) {
    organization = {
      id: azureData[0].id,
      name: azureData[0].name,
      description: azureData[0].description,
      url: azureData[0].url,
      avatarUrl: azureData[0].avatarUrl,
      createdAt: azureData[0].createdAt,
      updatedAt: azureData[0].updatedAt,
      organizationType: azureData[0].organizationType,
      hasPaidPlan: azureData[0].hasPaidPlan,
      access_token: azureData[0].access_token,
      refresh_token: azureData[0].refresh_token,
      scopes: azureData[0].scopes,
    };
  }

  return organization;
}
