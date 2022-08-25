import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import MyAdapter from "../../../utils/auth/adapter";

export default NextAuth({
  adapter: MyAdapter(),
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
