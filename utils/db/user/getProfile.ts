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

  const query = `SELECT * FROM [dbo].[profiles] WHERE id = '${userId}' FOR JSON PATH`;

  let data = await executeRequest(query);

  if (data) {
    userProfile = {
      userId,
      name: "",
      username: data[0].username,
      lastName: "",
      email: "",
      phone: "",
      createdAt: "",
      updatedAt: "",
      website: data[0].website,
      profileImage: data[0].avatar_url,
      company: "",
      isAdmin: false,
    };
    return userProfile;
  }
}
