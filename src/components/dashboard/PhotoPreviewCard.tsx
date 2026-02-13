"use client";

import Link from "next/link";
import Image from "next/image";
import { Camera } from "lucide-react";

interface Photo {
  id: string;
  thumbnail: string | null;
  url: string;
  description: string | null;
}

interface PhotoPreviewCardProps {
  photos: Photo[];
}

const ROTATIONS = [-3, 1, -2];

export function PhotoPreviewCard({ photos }: PhotoPreviewCardProps) {
  const displayPhotos = photos.slice(0, 3);
  const hasPhotos = displayPhotos.length > 0;

  return (
    <Link href="/timeline" className="block">
      <div className="card bg-surface-primary paper-texture rounded-[var(--radius-lg)] border border-border-light p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-surface-secondary">
            <Camera size={20} className="text-text-muted-dark" />
          </div>
          <p className="text-body-md text-text-dark font-medium">
            Последние фото
          </p>
        </div>

        {hasPhotos ? (
          <div className="flex items-center justify-center py-2">
            {displayPhotos.map((photo, i) => (
              <div
                key={photo.id}
                className="relative bg-white p-1.5 pb-3 rounded-sm shadow-[var(--shadow-soft)]"
                style={{
                  transform: `rotate(${ROTATIONS[i]}deg)`,
                  marginLeft: i > 0 ? "-8px" : "0",
                  zIndex: i,
                }}
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-sm">
                  <Image
                    src={photo.thumbnail ?? photo.url}
                    alt={photo.description ?? ""}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body-sm text-text-muted-dark italic text-center py-4">
            Пока нет моментов
          </p>
        )}
      </div>
    </Link>
  );
}
