export type Organization = {
  id: string;
  name: string;
  description?: string;
  url: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt?: string;
  organizationType?: string;
  hasPaidPlan: boolean;
  access_token: string;
  refresh_token: string;
  scopes: string[];
  jira_id: string;
  user_email: string;
};
