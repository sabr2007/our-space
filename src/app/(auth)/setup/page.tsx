import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const userCount = await db.user.count();

  if (userCount > 0) {
    redirect("/login");
  }

  return <SetupForm />;
}
