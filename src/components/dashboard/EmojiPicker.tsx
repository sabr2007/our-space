"use client";

import { useState, useRef, useEffect } from "react";

interface EmojiPickerProps {
  currentMood: { emoji: string; label: string } | null;
  onMoodSelect: (emoji: string, label: string) => void;
}

const MOODS = [
  { emoji: "\u{1F60A}", label: "Счастлив", color: "var(--color-mood-happy)" },
  { emoji: "\u{1F970}", label: "Влюблён", color: "var(--color-mood-love)" },
  { emoji: "\u{1F622}", label: "Скучаю", color: "var(--color-mood-miss)" },
  { emoji: "\u{1F634}", label: "Спокоен", color: "var(--color-mood-calm)" },
  { emoji: "\u{1F929}", label: "Восторг", color: "var(--color-mood-excited)" },
  { emoji: "\u{1F4AC}", label: "Поговорим", color: "var(--color-mood-need-talk)" },
] as const;

export function EmojiPicker({ currentMood, onMoodSelect }: EmojiPickerProps) {
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSelect = (emoji: string, label: string) => {
    setAnimatingEmoji(emoji);
    onMoodSelect(emoji, label);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnimatingEmoji(null), 400);
  };

  const selectedMood = MOODS.find((m) => m.emoji === currentMood?.emoji);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {MOODS.map((mood) => {
          const isSelected = currentMood?.emoji === mood.emoji;
          const isAnimating = animatingEmoji === mood.emoji;

          return (
            <button
              key={mood.emoji}
              type="button"
              onClick={() => handleSelect(mood.emoji, mood.label)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-2xl
                bg-surface-secondary border border-border-light
                transition-all duration-200
                hover:scale-115
              `}
              style={{
                boxShadow: isSelected
                  ? `0 0 12px ${mood.color}, 0 0 0 2px ${mood.color}`
                  : undefined,
                borderColor: isSelected ? mood.color : undefined,
                animation: isAnimating
                  ? "moodSelect 400ms ease-out"
                  : undefined,
              }}
              aria-label={mood.label}
            >
              {mood.emoji}
            </button>
          );
        })}
      </div>
      {selectedMood && (
        <p
          className="text-ui-sm text-center mt-3 transition-all duration-200"
          style={{ color: selectedMood.color }}
        >
          {selectedMood.label}
        </p>
      )}
    </div>
  );
}
