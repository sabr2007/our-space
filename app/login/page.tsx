"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid key");
        setLoading(false);
        return;
      }

      // Success - redirect to timeline
      router.push("/timeline");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="font-display text-5xl md:text-6xl text-center mb-2 text-foreground">
          Our Space
        </h1>
        <p className="text-center text-text-secondary text-sm mb-12">
          A private space for two
        </p>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="key"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Enter your key
            </label>
            <input
              type="password"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent focus:glow-rose transition-smooth"
              placeholder="Your secret key"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-accent text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-warm focus:outline-none focus:glow-rose transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
