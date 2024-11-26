import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TwoFactorAuthForm from "./two-factor-auth-form";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";

export default async function MyAccount() {
  const session = await auth();

  const userId = session?.user?.id ? parseInt(session.user.id) : null;
  if (!userId) {
    throw new Error("問題が発生いたしました。無効なIDです。");
  }

  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated,
    })
    .from(users)
    .where(eq(users.id, userId));

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>マイアカウント</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>メールアドレス</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
        <TwoFactorAuthForm twoFactorActivated={user.twoFactorActivated ?? false} />
      </CardContent>
    </Card>
  );
}
