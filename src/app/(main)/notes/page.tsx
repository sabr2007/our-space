import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getNotes } from "@/actions/notes";
import { NotesList } from "@/components/notes/NotesList";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const result = await getNotes();

  if ("error" in result) {
    return (
      <div className="py-12">
        <h1 className="text-display-lg text-text-cream mb-4">Записки</h1>
        <p className="text-body-md text-text-muted-light">{result.error}</p>
      </div>
    );
  }

  return (
    <NotesList
      sent={result.data.sent}
      received={result.data.received}
      partnerName={result.data.partnerName}
      currentUserId={session.user.id}
    />
  );
}
