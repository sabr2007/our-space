import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTimelinePhotos } from "@/actions/timeline";
import { TimelineView } from "@/components/timeline/TimelineView";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const result = await getTimelinePhotos();

  if (!("success" in result)) {
    return (
      <div className="py-12">
        <h1 className="text-display-lg text-text-cream mb-4">Моменты</h1>
        <p className="text-body-md text-text-muted-light">{result.error}</p>
      </div>
    );
  }

  return <TimelineView photos={result.data} />;
}
