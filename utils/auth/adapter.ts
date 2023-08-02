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
      let createdUser = await executeRequest(
        `EXEC [dbo].[create_user] @email = '${user.email}',${
          user.name ? ` @name = '${user.name}',` : ""
        } @emailVerified = '${makeISO(user.emailVerified as any)}';
        `
      );
      return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        emailVerified: createdUser.emailVerified,
        image: createdUser.image,
      };
    },
    async getUser(id): Promise<AdapterUser> {
      let userData = await executeRequest(
        `EXEC [dbo].[get_user] @id = '${id}';
        `
      );
      if (!userData.email) {
        return null;
      }
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        image: userData.image,
      };
    },
    async getUserByEmail(email): Promise<AdapterUser> {
      let userData = await executeRequest(
        `EXEC [dbo].[get_user_by_email] @email = '${email}';
        `
      );
      if (!userData.email) {
        return null;
      }
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        image: userData.image,
      };
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser> {
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
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
      };
    },
    async deleteUser(userId): Promise<AdapterUser> {
      console.log("deleteUser", userId);
      return;
    },
    async linkAccount(account): Promise<void> {
      await executeRequest(
        `EXEC [dbo].[create_account] @user_id = '${account.id}', @provider_type = '${account.provider}', @provider_id = '${account.provider_id}, @provider_account_id = '${account.providerAccountId}',  @access_token ='${account.access_token}', @refresh_token = '${account.refresh_token}', @scopes = '${account.scopes}', @access_token_expires = '${account.expires_in}';
        `
      );
    },
    async unlinkAccount({ providerAccountId, provider }): Promise<void> {
      console.log("unlinkAccount", providerAccountId, provider);
    },
    async createSession({
      sessionToken,
      userId,
      expires,
    }): Promise<AdapterSession> {
      let createdSession = await executeRequest(
        `EXEC [dbo].[create_session] @session_token = '${sessionToken}', @userId = '${userId}', @expires = '${new Date(
          expires
        ).toISOString()}';
        `
      );
      return {
        id: createdSession.id as string,
        sessionToken: createdSession.session_token as string,
        userId: createdSession.user_id as string,
        expires: new Date(createdSession.expires),
      } as AdapterSession;
    },
    async getSessionAndUser(
      sessionToken
    ): Promise<{ session: AdapterSession; user: AdapterUser }> {
      let fetchedSession = await executeRequest(
        `EXEC [dbo].[get_session] @sessionToken = '${sessionToken}';
        `
      );
      let fetchedUser = await executeRequest(
        `EXEC [dbo].[get_user] @id = '${fetchedSession.user_id}';`
      );
      const session = {
        id: fetchedSession.id as string,
        sessionToken: fetchedSession.session_token as string,
        userId: fetchedSession.user_id as string,
        expires: new Date(fetchedSession.expires),
      };
      const user = {
        id: fetchedUser.id,
        name: fetchedUser.name,
        email: fetchedUser.email,
        emailVerified: new Date(fetchedUser.email_verified),
      };
      return {
        session,
        user,
      };
    },
    async updateSession({
      sessionToken,
      userId,
      expires,
    }): Promise<AdapterSession> {
      let updatedSession = await executeRequest(
        `EXEC [dbo].[update_session] @session_token = '${sessionToken}', @userId = '${userId}', @expires = '${new Date(
          expires
        ).toISOString()}';
        `
      );
      const session = {
        id: updatedSession.id as string,
        sessionToken: updatedSession.session_token as string,
        userId: updatedSession.user_id as string,
        expires: new Date(updatedSession.expires),
      };
      return session;
    },
    async deleteSession(sessionToken): Promise<AdapterSession> {
      let deletedSession = await executeRequest(
        `EXEC [dbo].[delete_session] @sessionToken = '${sessionToken}';
        `
      );
      const session = {
        id: deletedSession.id as string,
        sessionToken: deletedSession.session_token as string,
        userId: deletedSession.user_id as string,
        expires: new Date(deletedSession.expires),
      };
      return session;
    },
    async createVerificationToken({
      identifier,
      expires,
      token,
    }): Promise<VerificationToken> {
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
      return await executeRequest(
        `EXEC [dbo].[delete_verification_token] @identifier = '${identifier}', @token = '${token}';
        `
      );
    },
  };
}
loc
