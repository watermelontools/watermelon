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
        `EXEC [dbo].[create_user] @email = '${user.email}', @name = '${
          user.name
        }, @emailVerified = '${new Date(
          user.emailVerified as string
        ).toISOString()}'';
        `
      );
    },
    async getUser(id) {
      console.log("getUser", id);
      let userData = await executeRequest(
        `EXEC [dbo].[get_user] @id = '${id}';
        `
      );
      if (!userData.email) {
        return null;
      }
      return userData;
    },
    async getUserByEmail(email) {
      console.log("getUserByEmail", email);
      let userData = await executeRequest(
        `EXEC [dbo].[get_user_by_email] @email = '${email}';
        `
      );
      if (!userData.email && email) {
        console.log("getUserByEmail", email, "not found");
        return await executeRequest(
          `EXEC [dbo].[create_user] @email = '${email}', @name = '${null}', @emailVerified = '${Date.now()}';
          `
        );
      }
      console.log("getUserByEmail", email, "FOUND");
      return userData;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount", providerAccountId, provider);
      let userData = await executeRequest(
        `EXEC [dbo].[get_user_by_account] @providerAccountId = '${providerAccountId}', @provider = '${provider}';
        `
      );
      if (!userData.email) {
        return null;
      }
      return userData;
    },
    async updateUser(user) {
      console.log("updateUser", user);
      if (!user.emailVerified || !user.email) {
        return null;
      }
      return await executeRequest(
        `EXEC [dbo].[update_user] @id = '${user.id}', @email = '${user.email}', @name = '${user.name}', @emailVerified = '${user.emailVerified}';
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
        `EXEC [dbo].[create_session] @session_token = '${sessionToken}', @userId = '${userId}', @expires = '${new Date(
          expires
        ).toISOString()}';
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
        `EXEC [dbo].[create_verification_token] @identifier = '${identifier}', @expires = '${new Date(
          expires
        ).toISOString()}', @token = '${token}';
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
