"use client";

import { useState, useRef, useCallback } from "react";
import { getAvatarUploadUrl, updateAvatar } from "@/actions/settings";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface ProfileSectionProps {
  user: { id: string; name: string; email: string; avatar: string | null };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Допускаются только изображения");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Файл слишком большой (максимум 5 МБ)");
        return;
      }

      setError(null);
      setSuccess(false);

      // Show local preview
      if (preview) URL.revokeObjectURL(preview);
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      setLoading(true);

      try {
        // 1. Get presigned URL
        const presignedResult = await getAvatarUploadUrl(
          file.name,
          file.type,
        );
        if ("error" in presignedResult) {
          setError(presignedResult.error);
          setPreview(null);
          URL.revokeObjectURL(localUrl);
          setLoading(false);
          return;
        }

        const { uploadUrl, fileUrl } = presignedResult.data;

        // 2. Upload to R2
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok) {
          setError("Ошибка загрузки файла. Попробуйте ещё раз.");
          setPreview(null);
          URL.revokeObjectURL(localUrl);
          setLoading(false);
          return;
        }

        // 3. Save avatar URL
        const saveResult = await updateAvatar(fileUrl);
        if ("error" in saveResult) {
          setError(saveResult.error);
          setPreview(null);
          URL.revokeObjectURL(localUrl);
          setLoading(false);
          return;
        }

        // 4. Success
        setAvatar(fileUrl);
        URL.revokeObjectURL(localUrl);
        setPreview(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        setError("Произошла ошибка. Попробуйте ещё раз.");
        setPreview(null);
        URL.revokeObjectURL(localUrl);
      } finally {
        setLoading(false);
      }

      // Reset file input so the same file can be re-selected
      e.target.value = "";
    },
    [preview],
  );

  const displaySrc = preview || avatar;

  return (
    <div className="settings-card-enter paper-texture rounded-[var(--radius-lg)] border border-border-light shadow-[var(--shadow-card)] p-6">
      <h2 className="text-display-sm text-text-dark mb-4">Профиль</h2>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {displaySrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displaySrc}
              alt={user.name}
              className="w-14 h-14 rounded-full border-2 border-border-light object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-border-light bg-surface-secondary flex items-center justify-center">
              <span className="text-body-md text-text-muted-dark font-medium">
                {initials}
              </span>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <span className="text-white text-xs animate-pulse">...</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-body-md text-text-dark font-medium truncate">
            {user.name}
          </p>
          <p className="text-ui-sm text-text-muted-dark truncate">
            {user.email}
          </p>
        </div>

        {/* Change button */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            aria-label="Изменить аватар"
            className="text-accent-gold font-ui font-medium text-[15px] px-4 py-2 hover:text-accent-gold-light hover:underline transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Изменить
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 font-ui text-sm text-accent-rose">{error}</p>
      )}
      {success && (
        <p className="mt-3 text-ui-sm text-accent-gold">Аватар обновлён</p>
      )}
    </div>
  );
}
