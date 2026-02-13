import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPlaylistItems } from "@/actions/playlist";
import { PlaylistView } from "@/components/playlist/PlaylistView";

export const dynamic = "force-dynamic";

export default async function PlaylistPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const result = await getPlaylistItems();

  if ("error" in result) {
    return (
      <div className="py-12">
        <h1 className="text-display-lg text-text-cream mb-4">Наша музыка</h1>
        <p className="text-body-md text-text-muted-light">{result.error}</p>
      </div>
    );
  }

  return (
    <PlaylistView
      items={result.data.items}
      totalCount={result.data.totalCount}
      currentUserId={session.user.id}
    />
  );
}
