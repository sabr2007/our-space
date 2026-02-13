"use client";

import { useState, useEffect, useCallback } from "react";
import { setMood } from "@/actions/dashboard";
import { EmojiPicker } from "./EmojiPicker";

interface MoodSectionProps {
  partnerName: string;
  partnerId: string;
  initialPartnerMood: {
    emoji: string;
    label: string;
    updatedAt: string;
  } | null;
  currentUserMood: { emoji: string; label: string } | null;
  moodPresets: Array<{ emoji: string; label: string }>;
}

function timeAgoRussian(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "только что";

  if (minutes < 60) {
    const mod10 = minutes % 10;
    const mod100 = minutes % 100;
    let word = "минут";
    if (mod100 >= 11 && mod100 <= 19) word = "минут";
    else if (mod10 === 1) word = "минуту";
    else if (mod10 >= 2 && mod10 <= 4) word = "минуты";
    return `${minutes} ${word} назад`;
  }

  if (hours < 24) {
    const mod10 = hours % 10;
    const mod100 = hours % 100;
    let word = "часов";
    if (mod100 >= 11 && mod100 <= 19) word = "часов";
    else if (mod10 === 1) word = "час";
    else if (mod10 >= 2 && mod10 <= 4) word = "часа";
    return `${hours} ${word} назад`;
  }

  const mod10 = days % 10;
  const mod100 = days % 100;
  let word = "дней";
  if (mod100 >= 11 && mod100 <= 19) word = "дней";
  else if (mod10 === 1) word = "день";
  else if (mod10 >= 2 && mod10 <= 4) word = "дня";
  return `${days} ${word} назад`;
}

export function MoodSection({
  partnerName,
  partnerId,
  initialPartnerMood,
  currentUserMood,
  moodPresets,
}: MoodSectionProps) {
  const [partnerMood, setPartnerMood] = useState(initialPartnerMood);
  const [userMood, setUserMood] = useState(currentUserMood);
  const [timeAgo, setTimeAgo] = useState(
    initialPartnerMood ? timeAgoRussian(initialPartnerMood.updatedAt) : ""
  );

  // Poll partner mood every 30 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/mood?partnerId=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.emoji) {
            setPartnerMood(data);
            setTimeAgo(timeAgoRussian(data.updatedAt));
          }
        }
      } catch {
        // Silently ignore polling errors
      }
    };

    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [partnerId]);

  // Update time-ago display every minute
  useEffect(() => {
    if (!partnerMood) return;

    const interval = setInterval(() => {
      setTimeAgo(timeAgoRussian(partnerMood.updatedAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [partnerMood]);

  const handleMoodSelect = useCallback(
    async (emoji: string, label: string) => {
      const previousMood = userMood;
      setUserMood({ emoji, label });
      try {
        const result = await setMood(emoji, label);
        if ("error" in result) {
          setUserMood(previousMood);
        }
      } catch {
        setUserMood(previousMood);
      }
    },
    [userMood]
  );

  return (
    <div className="bg-surface-primary paper-texture rounded-[var(--radius-lg)] border border-border-light p-6 shadow-[var(--shadow-card)]">
      {/* Partner mood */}
      <div className="mb-6">
        <p className="text-ui-sm text-text-muted-dark mb-3">
          Настроение {partnerName}:
        </p>
        {partnerMood ? (
          <div className="flex items-center gap-3">
            <span
              className="text-[32px] leading-none"
              style={{
                filter: "drop-shadow(0 0 8px rgba(200, 148, 63, 0.3))",
              }}
            >
              {partnerMood.emoji}
            </span>
            <div>
              <p className="text-body-md text-text-dark font-medium">
                {partnerMood.label}
              </p>
              <p className="text-ui-sm text-text-muted-dark">{timeAgo}</p>
            </div>
          </div>
        ) : (
          <p className="text-body-sm text-text-muted-dark italic">
            Ещё не выбрано
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border-light my-4" />

      {/* User mood */}
      <div>
        <p className="text-ui-sm text-text-muted-dark mb-3">
          Твоё настроение:
        </p>
        <EmojiPicker currentMood={userMood} onMoodSelect={handleMoodSelect} presets={moodPresets} />
      </div>
    </div>
  );
}
