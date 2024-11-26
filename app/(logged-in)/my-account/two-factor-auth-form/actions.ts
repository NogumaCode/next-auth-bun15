"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const get2faSecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "無許可となっております",
    };
  }

  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "ユーザーが見当たりませんでした",
    };
  }

  let twoFactorSecret = user.twoFactorSecret;

  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await db
      .update(users)
      .set({
        twoFactorSecret,
      })
      .where(eq(users.id, parseInt(session.user.id)));
  }

  if (!session.user.email) {
    return {
      error: true,
      message: "メールアドレスが見つかりませんでした",
    };
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session.user.email ?? "",
      "Web Dev Education",
      twoFactorSecret
    ),
  };
};

export const activate2fa = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "無許可となっております",
    };
  }

  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "ユーザーが見当たりませんでした",
    };
  }
  if (user.twoFactorSecret) {
    const tokenValid = authenticator.check(token, user.twoFactorSecret);

    if (!tokenValid) {
      return {
        error: true,
        message: "無効なパスワードです",
      };
    }
    await db
      .update(users)
      .set({
        twoFactorActivated: true,
      })
      .where(eq(users.id, parseInt(session.user.id)));
  }
};

export const disable2fa =async ()=>{
    const session = await auth();

    if (!session?.user?.id) {
      return {
        error: true,
        message: "無許可となっております",
      };
    }
    await db
      .update(users)
      .set({
        twoFactorActivated: false,
      })
      .where(eq(users.id, parseInt(session.user.id)));
}
