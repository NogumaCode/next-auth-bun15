import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default async function MyAccount(){

  const session = await auth()
  return(
    <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>マイアカウント</CardTitle>
    </CardHeader>
    <CardContent>
      <Label>メールアドレス</Label>
    <div className="text-muted-foreground">
      {session?.user?.email}
    </div>
    </CardContent>
    </Card>

  )
}
