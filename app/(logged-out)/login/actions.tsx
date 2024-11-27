"use server";

import { z } from "zod";
import { passwordSchema } from "@/validation/passwordSchema";
import { signIn } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const loginWithCredentials = async ({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token?: string;
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.issues[0]?.message ?? "エラーが起きました",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      token,
      redirect: false,
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    return {
      error: true,
      message: "メールアドレスかパスワードが異なります",
    };
  }
};

export const preLoginCheck = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return {
      error: true,
      message: "認証できませんでした",
    };
  } else {
    const passwordCorrect = await compare(password, user.password!);
    if (!passwordCorrect) {
      return {
        error: true,
        message: "認証できませんでした",
      };
    }
  }
  return {
    twoFactorActivated: user.twoFactorActivated,
  };
};
