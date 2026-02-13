"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { updateStartDate } from "@/actions/settings";

interface RelationshipSectionProps {
  startDate: string;
}

function toDateInputValue(isoString: string): string {
  return new Date(isoString).toISOString().split("T")[0];
}

export function RelationshipSection({ startDate }: RelationshipSectionProps) {
  const initialValue = toDateInputValue(startDate);
  const [date, setDate] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanged = date !== initialValue;

  const handleSave = useCallback(async () => {
    if (!hasChanged || !date) return;

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const result = await updateStartDate(date);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }, [hasChanged, date]);

  return (
    <div className="settings-card-enter paper-texture rounded-[var(--radius-lg)] border border-border-light shadow-[var(--shadow-card)] p-6">
      <h2 className="text-display-sm text-text-dark mb-4">Отношения</h2>

      <div>
        <label
          htmlFor="start-date"
          className="text-ui-sm text-text-muted-dark mb-1 block"
        >
          Дата начала
        </label>
        <input
          id="start-date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          className="w-full bg-surface-secondary border border-border-light rounded-[var(--radius-md)] px-4 py-3 text-body-md text-text-dark font-body focus:border-accent-gold focus:outline-none transition-colors"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanged}
          loading={loading}
        >
          Сохранить
        </Button>

        {success && (
          <span className="text-accent-gold text-ui-sm">Дата обновлена</span>
        )}
        {error && (
          <span className="text-accent-rose text-ui-sm">{error}</span>
        )}
      </div>
    </div>
  );
}
