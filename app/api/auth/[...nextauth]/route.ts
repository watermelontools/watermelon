import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import MyAdapter from "../../../../utils/auth/adapter";
export const authOptions: NextAuthOptions = {
  adapter: MyAdapter(),
  callbacks: {
    // add the id to the session as accessToken
    async session({ session, token, user }) {
      if (session.user) {
        session.user.name = user.id;
      }
      return session;
    },
  },
  pages: {
    verifyRequest: "/auth/verify",
  },
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "#238636", // Hex color code
    logo: "/favicon/favicon-32x32.png", // Absolute URL to image
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
      // @ts-ignore
      name: "Watermelon Auth",
    }),
  ],
};
// @ts-ignore
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
