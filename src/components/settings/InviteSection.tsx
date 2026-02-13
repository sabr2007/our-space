"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateInviteLink } from "@/actions/settings";

interface InviteSectionProps {
  partner: { id: string; name: string } | null;
  existingToken: string | null;
}

export function InviteSection({ partner, existingToken }: InviteSectionProps) {
  const [token, setToken] = useState<string | null>(existingToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteUrl =
    token && typeof window !== "undefined"
      ? `${window.location.origin}/invite/${token}`
      : null;

  const handleGenerate = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await generateInviteLink();
      if ("error" in result) {
        setError(result.error);
      } else {
        setToken(result.data.token);
      }
    } catch {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [inviteUrl]);

  return (
    <div className="settings-card-enter paper-texture rounded-[var(--radius-lg)] border border-border-light shadow-[var(--shadow-card)] p-6">
      <h2 className="text-display-sm text-text-dark mb-4">
        Пригласить партнёра
      </h2>

      {partner ? (
        <div className="flex items-center gap-3">
          <Check size={20} className="text-[#7B917B]" />
          <div>
            <p className="text-body-md text-[#7B917B] font-medium">
              Партнёр подключён
            </p>
            <p className="text-body-md text-text-dark">{partner.name}</p>
          </div>
        </div>
      ) : (
        <div>
          {inviteUrl ? (
            <div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-surface-secondary rounded-[var(--radius-md)] px-4 py-3 font-mono text-ui-sm text-text-dark break-all">
                  {inviteUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-2 text-text-muted-dark hover:text-accent-gold transition-colors"
                  aria-label="Скопировать ссылку"
                >
                  <Copy size={18} />
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-ui-sm text-accent-gold">
                  Скопировано!
                </p>
              )}
              <p className="mt-2 text-ui-sm text-text-muted-dark">
                Ссылка одноразовая
              </p>
            </div>
          ) : (
            <Button onClick={handleGenerate} loading={loading}>
              Создать ссылку-приглашение
            </Button>
          )}

          {error && (
            <p className="mt-3 font-ui text-sm text-accent-rose">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
