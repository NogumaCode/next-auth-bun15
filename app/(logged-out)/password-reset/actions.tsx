"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { users } from "@/db/usersSchema";
import { mailer } from "@/lib/mail";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export const passwordReset = async (emailAddress: string) => {
  const session = await auth();

  if (!!session?.user?.id) {
    return {
      error: true,
      message: "既にログインしています",
    };
  }

  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, emailAddress));

  if (!user) {
    return;
  }

  const passwordResetToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000);

  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });

  const resetLink = `${process.env.SITE_BASE_URL}/update-password?token=${passwordResetToken}`;

  await mailer.sendMail({
    from: "test@resend.dev",
    subject: "パスワードリセットのご案内",
    to: emailAddress,
    html: `
    <p>こんにちは、${emailAddress}様。</p>
    <p>パスワードリセットのリクエストを受け付けました。以下のリンクからパスワードをリセットしてください。</p>
    <p>このリンクは1時間で無効になります。</p>
    <a href="${resetLink}" target="_blank">${resetLink}</a>
  `,
  });

  // console.log(passwordResetToken);
};
