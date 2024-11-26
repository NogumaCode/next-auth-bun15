"use client";

import { Button } from "@/components/ui/button";
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

import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "./acrions";
import Link from "next/link";

const formSchema = passwordMatchSchema;

type Props = {
  token: string;
};
export default function UpdatePasswordForm({ token }: Props) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await updatePassword({
      token,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.tokenIsValid) {
      window.location.reload();
    }
    if (response?.error) {
      form.setError("root", {
        message: response.message,
      });
    } else {
      toast({
        title: "パスワードの変更",
        description: "パスワードを更新しました",
        className: "bg-green-500 text-white",
      });
      form.reset();
    }
  };
  return form.formState.isSubmitSuccessful ? (
    <div>
      パスワードを更新いたしました。<Link className="underline" href="/login">アカウントにログインする</Link>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新しいパスワード</FormLabel>
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
                <FormLabel>新しい確認用パスワード</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!form.formState.errors.root?.message && (
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          )}
          <Button type="submit" className="mt-2">
            パスワード更新
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}