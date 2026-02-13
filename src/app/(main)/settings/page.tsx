import { getSettingsData } from "@/actions/settings";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/SettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const result = await getSettingsData();
  if ("error" in result) {
    redirect("/login");
  }
  return <SettingsView data={result.data} />;
}
