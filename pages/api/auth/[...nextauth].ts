import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import MyAdapter from "../../../utils/auth/adapter";

export default NextAuth({
  adapter: MyAdapter(),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", user, account, profile, email, credentials);
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect", url, baseUrl);
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log("session", session, user, token);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt", token, user, account, profile, isNewUser);
      return token;
    },
  },
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        username: process.env.EMAIL_SERVER_USERNAME,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          username: process.env.EMAIL_SERVER_USERNAME,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      name: "Watermelon Auth",
    }),
  ],
});
