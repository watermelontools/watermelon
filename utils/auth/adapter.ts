import executeRequest from "../db/azuredb";
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
import { Account } from "next-auth";
/** @return { import("next-auth/adapters").Adapter } */
function makeISO(date: string | Date) {
  return new Date(date).toISOString();
}

export default function MyAdapter(): Adapter {
  return {
    async createUser(user): Promise<AdapterUser> {
      console.log("createUser", user);
      return await executeRequest(
        `EXEC [dbo].[create_user] @email = '${user.email}', @name = '${
          user.name
        }, @emailVerified = '${makeISO(user.emailVerified as string)}'}';
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
      if (!user.emailVerified || !user.id) {
        return null;
      }
      let updatedUser = await executeRequest(
        `EXEC [dbo].[update_user] @id = '${user.id}', ${
          user.email ? `@email = '${user.email}',` : ""
        } ${
          user.name ? `@name = '${user.name}',` : ""
        } @emailVerified = '${makeISO(user.emailVerified)}';
        `
      );
      console.log("updateUser from DB", updatedUser);
      console.log(updatedUser);
      return updatedUser;
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
      let createdSession = await executeRequest(
        `EXEC [dbo].[create_session] @session_token = '${sessionToken}', @userId = '${userId}', @expires = '${new Date(
          expires
        ).toISOString()}';
        `
      );
      return {
        id: createdSession.id,
        sessionToken: createdSession.session_token,
        userId: createdSession.user_id,
        expires: new Date(createdSession.expires),
      };
    },
    async getSessionAndUser(
      sessionToken
    ): Promise<{ session: AdapterSession; user: AdapterUser }> {
      console.log("getSessionAndUser", sessionToken);
      let fetchedSession = await executeRequest(
        `EXEC [dbo].[get_session] @sessionToken = '${sessionToken}';
        `
      );
      let fetchedUser = await executeRequest(
        `EXEC [dbo].[get_user] @id = '${fetchedSession.user_id}';`
      );
      return {
        session: {
          id: fetchedSession.id,
          sessionToken: fetchedSession.session_token,
          userId: fetchedSession.user_id,
          expires: new Date(fetchedSession.expires),
        },
        user: {
          id: fetchedUser.id,
          name: fetchedUser.name,
          email: fetchedUser.email,
          emailVerified: new Date(fetchedUser.email_verified),
        },
      };
    },
    async updateSession({
      sessionToken,
      userId,
      expires,
    }): Promise<AdapterSession> {
      console.log("updateSession", sessionToken);
      let updatedSession = await executeRequest(
        `EXEC [dbo].[update_session] @session_token = '${sessionToken}', @userId = '${userId}', @expires = '${new Date(
          expires
        ).toISOString()}';
        `
      );
      return {
        id: updatedSession.id,
        sessionToken: updatedSession.session_token,
        userId: updatedSession.user_id,
        expires: new Date(updatedSession.expires),
      };
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
