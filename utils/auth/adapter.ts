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
        `EXEC [dbo].[create_user] @id = '${user.id}', @email = '${user.email}', @name = '${user.name}, @emailVerified = '${user.emailVerified}'';
        `
      );
    },
    async getUser(id) {
      console.log("getUser", id);
      return await executeRequest(
        `EXEC [dbo].[get_user] @id = '${id}';
        `
      );
    },
    async getUserByEmail(email) {
      console.log("getUserByEmail", email);
      return await executeRequest(
        `EXEC [dbo].[get_user_by_email] @email = '${email}';
        `
      );
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount", providerAccountId, provider);
      return await executeRequest(
        `EXEC [dbo].[get_user_by_account] @providerAccountId = '${providerAccountId}', @provider = '${provider}';
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
        `EXEC [dbo].[create_verification_token] @identifier = '${identifier}', @expires = '${expires}', @token = '${token}';
        `
      );
    },
    async useVerificationToken({ identifier, token }) {
      console.log("useVerificationToken", identifier, token);
      return await executeRequest(
        `EXEC [dbo].[delete_verification_token] @identifier = '${identifier}', @token = '${token}';
        `
      );
    },
  };
}
