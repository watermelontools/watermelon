import { supabase } from "../../supabase";
import { UserProfile } from "../../../types/UserProfile";

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
