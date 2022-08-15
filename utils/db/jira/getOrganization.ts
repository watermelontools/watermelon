import { Organization } from "../../../types/jira/Organization";
import { supabase } from "../../supabase";
import executeRequest from "../azuredb";

export default async function getJiraOrganization(user): Promise<Organization> {
  let { data, error, status } = await supabase
    .from("Jira")
    .select("organization")
    .eq("user", user);
  if (error && status !== 406) {
    throw error;
  }
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
    "SELECT * FROM dbo.profiles WHERE id = '" + user + "'"
  );
  console.log(azureData);
  if (data) {
    organization = {
      id: data[0].id,
      name: data[0].name,
      description: data[0].description,
      url: data[0].url,
      avatarUrl: data[0].avatarUrl,
      createdAt: data[0].createdAt,
      updatedAt: data[0].updatedAt,
      organizationType: data[0].organizationType,
      hasPaidPlan: data[0].hasPaidPlan,
      access_token: data[0].access_token,
      refresh_token: data[0].refresh_token,
      scopes: data[0].scopes,
    };
  }

  return organization;
}
