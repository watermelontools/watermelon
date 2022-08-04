export type UserProfile = {
  userId: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
  website?: string;
  profileImage?: string;
  company?: string;
  isAdmin: boolean;
};
