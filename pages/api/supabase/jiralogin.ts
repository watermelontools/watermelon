import { supabase } from "../../../utils/supabase";
export default async function handler(req, res) {
  let { data, error, status } = await supabase.from("test").insert({});
  if (error) res.send(error);
  res.send(data);
}
