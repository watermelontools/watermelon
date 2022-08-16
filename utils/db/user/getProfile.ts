import { supabase } from "../../supabase";
import { UserProfile } from "../../../types/UserProfile";
import executeRequest from "../azuredb";
export default async function getUserProfile(
  userId: string
): Promise<UserProfile> {
  let userProfile = {
    userId,
    name: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    createdAt: "",
    updatedAt: "",
    website: "",
    profileImage: "",
    company: "",
    isAdmin: false,
  };

  const query = `SELECT * FROM [dbo].[profiles] WHERE id = '${userId}' FROM JSON PATH`;

  let azureResp = await executeRequest(query);
  console.log("azureResp profile", azureResp);
  let { data, error, status } = await supabase
    .from("profiles")
    .select(`username, website, avatar_url`)
    .eq("id", userId)
    .single();

  if (error && status !== 406) {
    throw error;
  }
  if (data) {
    userProfile = {
      userId,
      name: "",
      username: data.username,
      lastName: "",
      email: "",
      phone: "",
      createdAt: "",
      updatedAt: "",
      website: data.website,
      profileImage: data.avatar_url,
      company: "",
      isAdmin: false,
    };
    return userProfile;
  }
}
