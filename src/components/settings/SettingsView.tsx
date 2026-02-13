"use client";

import type { SettingsData } from "@/actions/settings";
import { ProfileSection } from "./ProfileSection";
import { RelationshipSection } from "./RelationshipSection";
import { InviteSection } from "./InviteSection";
import { MoodPresetManager } from "./MoodPresetManager";

interface SettingsViewProps {
  data: SettingsData;
}

export function SettingsView({ data }: SettingsViewProps) {
  return (
    <div className="py-8 md:py-12 max-w-2xl mx-auto">
      <h1 className="stagger-1 text-display-lg text-text-cream">Настройки</h1>

      <div className="flex flex-col gap-6 mt-8">
        <div className="stagger-2">
          <ProfileSection user={data.user} />
        </div>
        <div className="stagger-3">
          <RelationshipSection startDate={data.coupleStartDate} />
        </div>
        <div className="stagger-4">
          <InviteSection
            partner={data.partner}
            existingToken={data.inviteToken}
          />
        </div>
        <div className="stagger-5">
          <MoodPresetManager presets={data.moodPresets} />
        </div>
      </div>
    </div>
  );
}
