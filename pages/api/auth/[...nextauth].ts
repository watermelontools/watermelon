import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import MyAdapter from "../../../utils/auth/adapter";

export default NextAuth({
  adapter: MyAdapter(),
  callbacks: {
    // add the id to the session as accessToken
    async session({ session, token, user }) {
      console.log("session", session);
      session.user.name = user.id;
      return session;
    },
  },
  pages: {
    verifyRequest: "/auth/verify",
  },
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "#238636", // Hex color code
    logo: "public/logo.png", // Absolute URL to image
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
