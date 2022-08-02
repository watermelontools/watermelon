import { supabase } from "../../../utils/supabase";

export default async function handler(req, res) {
  let { user } = req.body;
  console.log("u", user);
  if (!user) {
    return res.send({ error: "no user" });
  }
  let { data, error, status } = await supabase
    .from("Jira")
    .select("organization")
    .eq("user", user);
  if (error) res.send(error);
  console.log("supadata", data);
  res.send(data[0]?.organization || { error: "no results" });
}
