"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Music } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SongCard from "./SongCard";
import { AddSongModal } from "./AddSongModal";
import { deletePlaylistItem } from "@/actions/playlist";

interface PlaylistItemData {
  id: string;
  title: string;
  artist: string | null;
  url: string;
  comment: string | null;
  createdAt: string;
  addedBy: { id: string; name: string };
}

interface PlaylistViewProps {
  items: PlaylistItemData[];
  totalCount: number;
  currentUserId: string;
}

function pluralizeSongs(n: number): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return "песен";
  if (last === 1) return "песня";
  if (last >= 2 && last <= 4) return "песни";
  return "песен";
}

export function PlaylistView({ items, totalCount, currentUserId }: PlaylistViewProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deletePlaylistItem(id);
      if ("error" in result) return;
      router.refresh();
    },
    [router],
  );

  const handleSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="py-8 md:py-12 space-y-6">
      <div className="stagger-1 flex items-center justify-between">
        <h1 className="text-display-lg text-text-cream">Наша музыка</h1>
        <Button onClick={() => setModalOpen(true)}>
          <span className="inline-flex items-center gap-2">
            <Plus size={18} />
            Добавить
          </span>
        </Button>
      </div>

      {totalCount > 0 && (
        <p className="stagger-2 text-ui-sm text-text-muted-light">
          {totalCount} {pluralizeSongs(totalCount)} в коллекции
        </p>
      )}

      <div className="stagger-3 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Music size={48} className="text-text-muted-light/40 mb-4" />
            <p className="text-display-sm text-text-muted-light mb-2">
              Плейлист пуст
            </p>
            <p className="text-body-sm text-text-muted-light/60 mb-6">
              Добавьте первую песню — ту, что значит для вас что-то особенное
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <span className="inline-flex items-center gap-2">
                <Plus size={18} />
                Добавить песню
              </span>
            </Button>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="song-card-enter"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <SongCard
                item={item}
                isOwner={item.addedBy.id === currentUserId}
                onDelete={handleDelete}
              />
            </div>
          ))
        )}
      </div>

      <AddSongModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
