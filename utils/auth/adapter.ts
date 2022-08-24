import executeRequest from "../db/azuredb";
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
import { Account } from "next-auth";
/** @return { import("next-auth/adapters").Adapter } */
export default function MyAdapter(): Adapter {
  return {
    async createUser(user): Promise<AdapterUser> {
      console.log("createUser", user);
      return await executeRequest(
        `EXEC [dbo].[create_user] @email = '${user.email}', @name = '${
          user.name
        }, @emailVerified = '${new Date(
          user.emailVerified as string
        ).toISOString()}';
        `
      );
    },
    async getUser(id): Promise<AdapterUser> {
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
    async getUserByEmail(email): Promise<AdapterUser> {
      console.log("getUserByEmail", email);
      let userData = await executeRequest(
        `EXEC [dbo].[get_user_by_email] @email = '${email}';
        `
      );
      if (!userData.email && email) {
        console.log("getUserByEmail", email, "not found");
        return await executeRequest(
          `EXEC [dbo].[create_user] @email = '${email}', @name = '${null}', @emailVerified = '${new Date().toISOString()}';
          `
        );
      }
      console.log("getUserByEmail", email, "FOUND");
      return userData;
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser> {
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
    async updateUser(user): Promise<AdapterUser> {
      console.log("updateUser", user);
      if (!user.emailVerified || !user.email) {
        return null;
      }
      return await executeRequest(
        `EXEC [dbo].[update_user] @id = '${user.id}', @email = '${user.email}', @name = '${user.name}', @emailVerified = '${user.emailVerified}';
        `
      );
    },
    async deleteUser(userId): Promise<AdapterUser> {
      console.log("deleteUser", userId);
      return;
    },
    async linkAccount(account): Promise<Account> {
      console.log("linkAccount", account);
      return await executeRequest(
        `EXEC [dbo].[create_account] @user_id = '${account.id}', @provider_type = '${account.provider}', @provider_id = '${account.provider_id}, @provider_account_id = '${account.providerAccountId}',  @access_token ='${account.access_token}', @refresh_token = '${account.refresh_token}', @scopes = '${account.scopes}', @access_token_expires = '${account.expires_in}';
        `
      );
    },
    async unlinkAccount({ providerAccountId, provider }): Promise<Account> {
      console.log("unlinkAccount", providerAccountId, provider);
      return;
    },
    async createSession({
      sessionToken,
      userId,
      expires,
    }): Promise<AdapterSession> {
      console.log("createSession", sessionToken, userId, expires);
      return await executeRequest(
        `EXEC [dbo].[create_session] @session_token = '${sessionToken}', @userId = '${userId}', @expires = '${new Date(
          expires
        ).toISOString()}';
        `
      );
    },
    async getSessionAndUser(
      sessionToken
    ): Promise<{ session: AdapterSession; user: AdapterUser }> {
      console.log("getSessionAndUser", sessionToken);
      return await executeRequest(
        `SELECT id, user_id, expires, session_token, token, created_at, updated_at FROM watermelon.dbo.sessions WHERE session_token = '${sessionToken}' FOR JSON PATH;
        `
      );
    },
    async updateSession({
      sessionToken,
      userId,
      expires,
    }): Promise<AdapterSession> {
      console.log("updateSession", sessionToken);
      return await executeRequest(
        `EXEC [dbo].[update_session] @session_token = '${sessionToken}', @userId = '${userId}', @expires = '${new Date(
          expires
        ).toISOString()}';
        `
      );
    },
    async deleteSession(sessionToken): Promise<AdapterSession> {
      console.log("deleteSession", sessionToken);
      return;
    },
    async createVerificationToken({
      identifier,
      expires,
      token,
    }): Promise<VerificationToken> {
      console.log("createVerificationToken", identifier, expires, token);
      return await executeRequest(
        `EXEC [dbo].[create_verification_token] @identifier = '${identifier}', @expires = '${new Date(
          expires
        ).toISOString()}', @token = '${token}';
        `
      );
    },
    async useVerificationToken({
      identifier,
      token,
    }): Promise<VerificationToken> {
      console.log("useVerificationToken", identifier, token);
      return await executeRequest(
        `EXEC [dbo].[delete_verification_token] @identifier = '${identifier}', @token = '${token}';
        `
      );
    },
  };
}
