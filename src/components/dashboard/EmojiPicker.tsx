"use client";

import { useState, useRef, useEffect } from "react";

interface EmojiPickerProps {
  currentMood: { emoji: string; label: string } | null;
  onMoodSelect: (emoji: string, label: string) => void;
  presets: Array<{ emoji: string; label: string }>;
}

const EMOJI_COLORS: Record<string, string> = {
  "\u{1F60A}": "var(--color-mood-happy)",
  "\u{1F970}": "var(--color-mood-love)",
  "\u{1F622}": "var(--color-mood-miss)",
  "\u{1F634}": "var(--color-mood-calm)",
  "\u{1F929}": "var(--color-mood-excited)",
  "\u{1F4AC}": "var(--color-mood-need-talk)",
};

const DEFAULT_COLOR = "var(--color-accent-gold)";

function getMoodColor(emoji: string): string {
  return EMOJI_COLORS[emoji] ?? DEFAULT_COLOR;
}

export function EmojiPicker({ currentMood, onMoodSelect, presets }: EmojiPickerProps) {
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

  const selectedPreset = presets.find((m) => m.emoji === currentMood?.emoji);
  const selectedColor = selectedPreset ? getMoodColor(selectedPreset.emoji) : undefined;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {presets.map((mood) => {
          const isSelected = currentMood?.emoji === mood.emoji;
          const isAnimating = animatingEmoji === mood.emoji;
          const color = getMoodColor(mood.emoji);

          return (
            <button
              key={mood.emoji}
              type="button"
              onClick={() => handleSelect(mood.emoji, mood.label)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-2xl
                bg-surface-secondary border border-border-light
                transition-all duration-200
                hover:scale-110
              `}
              style={{
                boxShadow: isSelected
                  ? `0 0 12px ${color}, 0 0 0 2px ${color}`
                  : undefined,
                borderColor: isSelected ? color : undefined,
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
      {selectedPreset && (
        <p
          className="text-ui-sm text-center mt-3 transition-all duration-200"
          style={{ color: selectedColor }}
        >
          {selectedPreset.label}
        </p>
      )}
    </div>
  );
}
