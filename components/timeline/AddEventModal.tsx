"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { createEvent } from "@/actions/events";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createEvent(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить событие">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-2">
            Название
          </label>
          <input
            name="title"
            required
            placeholder="Первое свидание"
            className="w-full px-4 py-3 bg-elevated border border-border rounded-lg text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent focus:glow-rose transition-smooth"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-2">
            Дата
          </label>
          <input
            name="date"
            type="date"
            required
            className="w-full px-4 py-3 bg-elevated border border-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:glow-rose transition-smooth"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-2">
            Описание (необязательно)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Как мы познакомились..."
            className="w-full px-4 py-3 bg-elevated border border-border rounded-lg text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent focus:glow-rose transition-smooth resize-none"
          />
        </div>
        {/* Photo upload will be added when Vercel Blob is configured */}
        <p className="text-xs text-text-muted">
          Загрузка фото будет доступна после настройки хранилища
        </p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-foreground transition-smooth">
            Отмена
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent-warm transition-smooth disabled:opacity-50">
            {loading ? "Добавление..." : "Добавить 📸"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
