"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { createNote } from "@/actions/notes";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNoteModal({ isOpen, onClose }: AddNoteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createNote(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Написать записку">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="content"
          required
          rows={6}
          maxLength={5000}
          placeholder="Напиши что-нибудь тёплое..."
          className="w-full px-4 py-3 bg-elevated border border-border rounded-lg text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent focus:glow-rose transition-smooth resize-none"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-foreground transition-smooth"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent-warm transition-smooth disabled:opacity-50"
          >
            {loading ? "Отправка..." : "Отправить 💌"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
