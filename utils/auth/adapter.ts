import executeRequest from "../db/azuredb";
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
/** @return { import("next-auth/adapters").Adapter } */
export default function MyAdapter(): Adapter {
  return {
    async createUser(user) {
      console.log("createUser", user);
      return await executeRequest(
        `INSERT INTO watermelon.dbo.users (id, name, email, email_verified, [image]) VALUES('${user.id}', '${user.name}', '${user.email}', '${user.emailVerified}', '', getdate(), getdate());
        `
      );
    },
    async getUser(id) {
      console.log("getUser", id);
      return await executeRequest(
        `SELECT id, name, email, email_verified, [image], created_at, updated_at FROM watermelon.dbo.users WHERE id = '${id} FOR JSON PATH';
        `
      );
    },
    async getUserByEmail(email) {
      console.log("getUserByEmail", email);
      return await executeRequest(
        `SELECT id, name, email, email_verified, [image], created_at, updated_at FROM watermelon.dbo.users WHERE email = '${email}' FOR JSON PATH;
        `
      );
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount", providerAccountId, provider);
      return await executeRequest(
        `SELECT id, compound_id, user_id, provider_type, provider_id, provider_account_id, refresh_token, access_token, access_token_expires, created_at, updated_at FROM watermelon.dbo.accounts WHERE provider_account_id = '${providerAccountId}' AND provider_type = '${provider}' FOR JSON PATH';
        `
      );
    },
    async updateUser(user) {
      console.log("updateUser", user);
      return await executeRequest(
        `UPDATE watermelon.dbo.users SET id='', name='', email='', email_verified='', [image]='', created_at=getdate(), updated_at=getdate() WHERE id = '${user.id}';
        `
      );
    },
    async deleteUser(userId) {
      console.log("deleteUser", userId);
      return;
    },
    async linkAccount(account) {
      console.log("linkAccount", account);
      return await executeRequest(
        `INSERT INTO watermelon.dbo.accounts (compound_id, user_id, provider_type, provider_id, provider_account_id, refresh_token, access_token, access_token_expires, created_at, updated_at) VALUES('', 0, '', '', '', '', '', '', getdate(), getdate());
        `
      );
    },
    async unlinkAccount({ providerAccountId, provider }) {
      console.log("unlinkAccount", providerAccountId, provider);
      return;
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log("createSession", sessionToken, userId, expires);
      return await executeRequest(
        `INSERT INTO watermelon.dbo.sessions (id, user_id, expires, session_token, token, created_at, updated_at) VALUES('', '', '', '', '', getdate(), getdate());
        `
      );
    },
    async getSessionAndUser(sessionToken) {
      console.log("getSessionAndUser", sessionToken);
      return await executeRequest(
        `SELECT id, user_id, expires, session_token, token, created_at, updated_at FROM watermelon.dbo.sessions WHERE session_token = '${sessionToken}' FOR JSON PATH;
        `
      );
    },
    async updateSession({ sessionToken }) {
      console.log("updateSession", sessionToken);
      return await executeRequest(
        `UPDATE watermelon.dbo.sessions SET id='', user_id='', expires='', session_token='', token='', created_at=getdate(), updated_at=getdate();
        `
      );
    },
    async deleteSession(sessionToken) {
      console.log("deleteSession", sessionToken);
      return;
    },
    async createVerificationToken({ identifier, expires, token }) {
      console.log("createVerificationToken", identifier, expires, token);
      return await executeRequest(
        `INSERT INTO watermelon.dbo.verification_tokens (identifier, token, expires, created_at, updated_at) VALUES('${identifier}', '${token}', '${expires}', getdate(), getdate());
        `
      );
    },
    async useVerificationToken({ identifier, token }) {
      console.log("useVerificationToken", identifier, token);
      return await executeRequest(
        `SELECT id, identifier, token, expires, created_at, updated_at FROM watermelon.dbo.verification_tokens WHERE identifier = '${identifier}' AND token = '${token}' FOR JSON PATH;
        `
      );
    },
  };
}
