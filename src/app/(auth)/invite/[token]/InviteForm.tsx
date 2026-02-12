"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerWithInvite } from "@/actions/auth";

export function InviteForm({
  token,
  inviterName,
}: {
  token: string;
  inviterName: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await registerWithInvite(token, email, password);

      if ("error" in result && result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Регистрация прошла, но не удалось войти. Попробуйте войти вручную.");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch {
      setError("Произошла ошибка. Попробуйте ещё раз.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-secondary rounded-[28px] p-8 w-full max-w-[400px] candle-glow flex flex-col items-center gap-6"
    >
      <div className="stagger-1">
        <Logo size="lg" />
      </div>

      <p className="font-body text-text-cream text-center text-base stagger-2">
        {inviterName} приглашает тебя в совместное пространство
      </p>

      <div className="w-full stagger-3">
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="w-full stagger-4">
        <Input
          id="password"
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Придумайте пароль"
          required
        />
      </div>

      {error && (
        <p className="text-accent-rose font-ui text-sm text-center">
          {error}
        </p>
      )}

      <div className="w-full stagger-5">
        <Button type="submit" fullWidth loading={loading}>
          Присоединиться
        </Button>
      </div>
    </form>
  );
}
