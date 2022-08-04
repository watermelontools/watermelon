import { supabase } from "../../supabase";

export default async function getJiraOrganization(user) {
  let { data, error, status } = await supabase
    .from("Jira")
    .select("organization")
    .eq("user", user);
  if (error && status !== 406) {
    throw error;
  }
  return { organization: data[0]?.organization } || { error: "no results" };
}
