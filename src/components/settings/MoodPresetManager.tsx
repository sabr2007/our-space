"use client";

import { useState, useCallback } from "react";
import { createMoodPreset, deleteMoodPreset } from "@/actions/settings";

interface MoodPreset {
  id: string;
  emoji: string;
  label: string;
  isDefault: boolean;
}

interface MoodPresetManagerProps {
  presets: MoodPreset[];
}

export function MoodPresetManager({ presets: initial }: MoodPresetManagerProps) {
  const [presets, setPresets] = useState<MoodPreset[]>(initial);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmoji, setNewEmoji] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = presets.length >= 20;

  const handleDelete = useCallback(
    async (id: string) => {
      const removed = presets.find((p) => p.id === id);
      if (!removed) return;

      // Optimistic removal
      setPresets((prev) => prev.filter((p) => p.id !== id));

      const result = await deleteMoodPreset(id);
      if ("error" in result) {
        // Restore on error
        setPresets((prev) => {
          const restored = [...prev];
          const originalIndex = initial.findIndex((p) => p.id === id);
          restored.splice(
            originalIndex >= 0 ? originalIndex : restored.length,
            0,
            removed,
          );
          return restored;
        });
        setError(result.error);
        setTimeout(() => setError(null), 3000);
      }
    },
    [presets, initial],
  );

  const handleAdd = useCallback(async () => {
    const emoji = newEmoji.trim();
    const label = newLabel.trim();

    if (!emoji || !label) {
      setError("Заполните оба поля");
      return;
    }

    setError(null);
    setAddLoading(true);

    // Optimistic add with temp ID
    const tempId = `temp-${Date.now()}`;
    const optimistic: MoodPreset = {
      id: tempId,
      emoji,
      label,
      isDefault: false,
    };
    setPresets((prev) => [...prev, optimistic]);
    setNewEmoji("");
    setNewLabel("");
    setShowAddForm(false);

    try {
      const result = await createMoodPreset(emoji, label);
      if ("error" in result) {
        // Remove optimistic entry
        setPresets((prev) => prev.filter((p) => p.id !== tempId));
        setError(result.error);
        setTimeout(() => setError(null), 3000);
      } else {
        // Replace temp ID with real ID
        setPresets((prev) =>
          prev.map((p) =>
            p.id === tempId ? { ...p, id: result.data.id } : p,
          ),
        );
      }
    } catch {
      setPresets((prev) => prev.filter((p) => p.id !== tempId));
      setError("Произошла ошибка. Попробуйте ещё раз.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setAddLoading(false);
    }
  }, [newEmoji, newLabel]);

  const handleCancel = useCallback(() => {
    setShowAddForm(false);
    setNewEmoji("");
    setNewLabel("");
    setError(null);
  }, []);

  return (
    <div className="settings-card-enter paper-texture rounded-[var(--radius-lg)] border border-border-light shadow-[var(--shadow-card)] p-6">
      <h2 className="text-display-sm text-text-dark mb-4">Настроения</h2>

      <div className="flex flex-wrap gap-2 mt-4">
        {presets.map((preset) => (
          <span
            key={preset.id}
            className="inline-flex items-center gap-1.5 bg-surface-secondary border border-border-light rounded-[var(--radius-md)] px-3 py-2 text-body-sm text-text-dark transition-all duration-150 hover:border-accent-gold hover:scale-[1.03]"
          >
            <span>{preset.emoji}</span>
            <span>{preset.label}</span>
            {!preset.isDefault && (
              <button
                onClick={() => handleDelete(preset.id)}
                className="ml-1 text-text-muted-dark hover:text-accent-rose transition-colors cursor-pointer text-sm"
                aria-label={`Удалить ${preset.label}`}
              >
                &times;
              </button>
            )}
          </span>
        ))}

        {/* Add button */}
        {!showAddForm && (
          <button
            onClick={() => !atLimit && setShowAddForm(true)}
            disabled={atLimit}
            className="inline-flex items-center gap-1.5 border border-dashed border-text-muted-dark/30 rounded-[var(--radius-md)] px-3 py-2 text-body-sm text-text-muted-dark hover:border-accent-gold hover:text-accent-gold cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Добавить настроение
          </button>
        )}
      </div>

      {atLimit && !showAddForm && (
        <p className="mt-2 text-ui-sm text-text-muted-dark">Максимум 20</p>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="flex items-center gap-2 mt-4" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } if (e.key === "Escape") handleCancel(); }}>
          <input
            type="text"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            placeholder="😊"
            maxLength={10}
            aria-label="Эмодзи настроения"
            className="w-[60px] bg-surface-secondary border border-border-light rounded-[var(--radius-md)] px-2 py-2 text-body-sm text-text-dark text-center focus:border-accent-gold focus:outline-none transition-colors"
          />
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Название"
            maxLength={50}
            aria-label="Название настроения"
            className="flex-1 bg-surface-secondary border border-border-light rounded-[var(--radius-md)] px-3 py-2 text-body-sm text-text-dark focus:border-accent-gold focus:outline-none transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={addLoading}
            aria-label="Добавить настроение"
            className="bg-accent-gold text-bg-deep font-ui font-semibold text-sm px-4 py-2 rounded-[var(--radius-md)] hover:bg-accent-gold-light transition-colors disabled:opacity-50"
          >
            {addLoading ? "..." : "OK"}
          </button>
          <button
            onClick={handleCancel}
            aria-label="Отменить добавление"
            className="text-text-muted-dark hover:text-text-dark font-ui text-sm px-2 py-2 transition-colors"
          >
            Отмена
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 font-ui text-sm text-accent-rose">{error}</p>
      )}
    </div>
  );
}
