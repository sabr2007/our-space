import { auth } from "@/lib/auth";
import { getDashboardData } from "@/actions/dashboard";
import { redirect } from "next/navigation";
import { RelationshipCounter } from "@/components/dashboard/RelationshipCounter";
import { MoodSection } from "@/components/dashboard/MoodSection";
import { UnreadNotesCard } from "@/components/dashboard/UnreadNotesCard";
import { PhotoPreviewCard } from "@/components/dashboard/PhotoPreviewCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const result = await getDashboardData();

  if ("error" in result) {
    return (
      <div className="py-12">
        <p className="text-body-md text-text-muted-light text-center">
          {result.error}
        </p>
      </div>
    );
  }

  const { partner, partnerMood, myMood, unreadNoteCount, recentPhotos, coupleStartDate, moodPresets } =
    result.data;

  return (
    <div className="py-8 md:py-12 space-y-8">
      {/* Greeting */}
      <div className="stagger-1 text-center">
        <p className="font-display text-display-sm text-text-muted-light">
          Привет, {session.user.name}
        </p>
      </div>

      {/* Relationship Counter */}
      <div className="stagger-2">
        <RelationshipCounter startDate={coupleStartDate} />
      </div>

      {/* Mood Section */}
      <div className="stagger-3">
        <MoodSection
          partnerName={partner.name}
          partnerId={partner.id}
          initialPartnerMood={partnerMood}
          currentUserMood={myMood ? { emoji: myMood.emoji, label: myMood.label } : null}
          moodPresets={moodPresets}
        />
      </div>

      {/* Cards Grid */}
      <div className="stagger-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UnreadNotesCard unreadCount={unreadNoteCount} />
        <PhotoPreviewCard photos={recentPhotos} />
      </div>
    </div>
  );
}
