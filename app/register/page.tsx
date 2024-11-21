"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { registerUser } from "./action";

// const formSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(5,"Password must contain at least 5 characters"),
//   passwordConfirm: z.string(),
// });

const formSchema = z.object({
  email: z
    .string()
    .email("有効なメールアドレスを入力してください"), // 日本語のカスタムメッセージ
}).and(passwordMatchSchema);

export default function Register() {
  //z.infer Zodライブラリで定義したスキーマから自動的にTypeScriptの型を推論するための機能
  //useForm Reactでフォームを簡単に扱えるようにするためのreact-hook-formのフックです。このフックを使うと、フォームの入力値、バリデーション、送信処理などが簡単に管理できます。
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), //フォームのバリデーションルールを指定するオプション
    defaultValues: {
      //各入力フィールドの初期値を設定するためのオプション
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await registerUser({
      email:data.email,
      password:data.password,
      passwordConfirm:data.passwordConfirm
    })
    console.log(response)
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>新規登録</CardTitle>
          <CardDescription>新規アカウント登録をしてください</CardDescription>
          <CardContent className="px-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
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
                <Button type="submit">新規登録</Button>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </main>
  );
}
