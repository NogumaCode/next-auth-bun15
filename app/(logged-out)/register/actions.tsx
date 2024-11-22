"use server";

import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { hash } from "bcryptjs";

type DatabaseError = Error & {
  code?: string;
};

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    const newUserSchema = z
      .object({
        email: z.string().email(),
      })
      .and(passwordMatchSchema);

    const newUserValidation = newUserSchema.safeParse({
      email,
      password,
      passwordConfirm,
    });

    if (!newUserValidation.success) {
      return {
        error: true,
        message:
          newUserValidation.error.issues[0]?.message ?? "エラーが起きました",
      };
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(password,10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
    });
  } catch (e: unknown) {
    const dbError = e as DatabaseError;

     if (dbError.code === "23505") {
      return {
        error: true,
        message: "メールアドレスは既に登録されております。",
      };
    }

    return {
      error: true,
      message: "エラーが発生しました",
    };
  }
};
