import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });
  if (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  } else {
    console.log(user);
    res.status(200).json(user);
  }
}
