import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { users } from "./db/usersSchema";
import db from "./db/drizzle";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { authenticator } from "otplib";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token:{}
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user) {
          throw new Error("認証できませんでした。");
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password!
          );
          if (!passwordCorrect) {
            throw new Error("認証できませんでした。");
          }

          if(user.twoFactorActivated){
            const tokenValid = authenticator.check(
              credentials.token as string,
              user.twoFactorSecret ?? ""
            )

            if (!tokenValid) {
              throw new Error("認証できませんでした。");
            }            

          }
        }
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
