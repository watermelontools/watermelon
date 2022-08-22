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
    jira_id: "",
    user_email: "",
  };
  let data = await executeRequest(`EXEC dbo.get_jira @user = '${user}'`);
  if (data) {
    organization = {
      id: data.id,
      name: data.name,
      description: data.description,
      url: data.url,
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      organizationType: data.organizationType,
      hasPaidPlan: data.hasPaidPlan,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      scopes: data.scopes,
      jira_id: data.jira_id,
      user_email: data.user_email,
    };
  }

  return organization;
}
