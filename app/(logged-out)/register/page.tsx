"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "./actions";
import Link from "next/link";

const formSchema = z
  .object({
    email: z.string().email("有効なメールアドレスを入力してください"), 
  })
  .and(passwordMatchSchema);

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //各入力フィールドの初期値を設定するためのオプション
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await registerUser({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
    //エラーがあった場合、メッセージを返す
    if (response?.error) {
      form.setError("email", {
        message: response?.message,
      });
    }
    console.log(response);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[350px]">
          <CardHeader className="mt-2">
            <CardTitle className="">アカウントは作成されました。</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">ログインする</Link>
              </Button>
            </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>新規登録</CardTitle>
            <CardDescription>新規アカウント登録をしてください</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <fieldset
                    disabled={form.formState.isSubmitting}
                    className="flex flex-col gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>メールアドレス</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>パスワード</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passwordConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>確認用パスワード</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-2">新規登録</Button>
                  </fieldset>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
          <div className="text-muted-foreground text-xs">
            アカウントを既に持っていますか？{" "}<Link href="/login" className="underline">ログイン</Link>
          </div>
        </CardFooter>
        </Card>
      )}
    </main>
  );
}
