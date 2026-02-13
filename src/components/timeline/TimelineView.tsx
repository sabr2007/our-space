"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TimelineCard } from "./TimelineCard";
import { PhotoModal } from "./PhotoModal";
import { AddMomentModal } from "./AddMomentModal";

interface TimelinePhoto {
  id: string;
  url: string;
  thumbnail: string | null;
  description: string | null;
  eventDate: string;
  createdAt: string;
  author: { id: string; name: string };
}

interface TimelineViewProps {
  photos: TimelinePhoto[];
}

/** Group photos by year (descending). */
function groupByYear(photos: TimelinePhoto[]) {
  const groups: { year: number; photos: TimelinePhoto[] }[] = [];
  const map = new Map<number, TimelinePhoto[]>();

  for (const photo of photos) {
    const year = new Date(photo.eventDate).getFullYear();
    if (!map.has(year)) {
      map.set(year, []);
    }
    map.get(year)!.push(photo);
  }

  for (const [year, yearPhotos] of map) {
    groups.push({ year, photos: yearPhotos });
  }

  groups.sort((a, b) => b.year - a.year);
  return groups;
}

export function TimelineView({ photos }: TimelineViewProps) {
  const router = useRouter();
  const [selectedPhoto, setSelectedPhoto] = useState<TimelinePhoto | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => groupByYear(photos), [photos]);

  // IntersectionObserver for scroll-triggered card animations
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        root: isDesktop ? desktopScrollRef.current : null,
        threshold: 0.1,
        rootMargin: isDesktop ? "0px -50px 0px 0px" : "0px 0px -50px 0px",
      },
    );

    const cards = container.querySelectorAll(".timeline-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [photos]);

  // Horizontal scroll helper for desktop
  useEffect(() => {
    const el = desktopScrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const handlePhotoClick = useCallback((photo: TimelinePhoto) => {
    setSelectedPhoto(photo);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  const isEmpty = photos.length === 0;

  return (
    <div className="py-8 md:py-12">
      {/* Header */}
      <div className="stagger-1 mb-8 flex items-center justify-between">
        <h1 className="text-display-lg text-text-cream">Наши моменты</h1>
        {!isEmpty && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold text-bg-deep transition-transform hover:scale-105 active:scale-95"
            aria-label="Добавить момент"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="stagger-2 flex flex-col items-center justify-center py-20 text-center">
          <Camera size={56} className="mb-4 text-text-muted-light" />
          <p className="text-display-sm text-text-muted-light">
            Пока нет моментов
          </p>
          <p className="text-body-md mt-2 max-w-sm text-text-muted-light">
            Загрузите первое фото, чтобы начать вашу историю
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowAddModal(true)}>
              Добавить момент
            </Button>
          </div>
        </div>
      ) : (
        <div ref={wrapperRef} className="stagger-2">
          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block">
            <div
              ref={desktopScrollRef}
              className="relative overflow-x-auto pb-6"
              style={{ scrollbarWidth: "thin" }}
            >
              {/* Horizontal line */}
              <div className="timeline-line absolute top-[calc(50%-1px)] left-0 right-0 h-[2px]" />

              <div className="relative flex items-center gap-6 px-4 py-8">
                {groups.map((group) => (
                  <div key={group.year} className="flex shrink-0 items-center gap-6">
                    {/* Year label */}
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="font-display text-lg font-semibold text-accent-gold">
                        {group.year}
                      </span>
                      <div className="timeline-dot mt-1" />
                    </div>

                    {/* Cards for this year, alternating above/below */}
                    {group.photos.map((photo, i) => (
                      <div
                        key={photo.id}
                        className={`relative flex items-center gap-3 ${
                          i % 2 === 0 ? "flex-col" : "flex-col-reverse"
                        }`}
                      >
                        <TimelineCard
                          photo={photo}
                          onClick={() => handlePhotoClick(photo)}
                        />
                        <div className="timeline-dot" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="block md:hidden">
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="timeline-line-vertical absolute left-[5px] top-0 bottom-0 w-[2px]" />

              {groups.map((group) => (
                <div key={group.year} className="mb-6">
                  {/* Year header */}
                  <div className="relative mb-4 flex items-center">
                    <div className="timeline-dot absolute left-[-27px]" />
                    <span className="font-display text-lg font-semibold text-accent-gold">
                      {group.year}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-4">
                    {group.photos.map((photo) => (
                      <div key={photo.id} className="relative">
                        <div className="timeline-dot absolute left-[-31px] top-6" />
                        <TimelineCard
                          photo={photo}
                          onClick={() => handlePhotoClick(photo)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
      <AddMomentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
