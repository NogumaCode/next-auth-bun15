"use server";

import { z } from "zod";
import { passwordSchema } from "@/validation/passwordSchema";
import { signIn } from "@/auth";

export const loginWithCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
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
