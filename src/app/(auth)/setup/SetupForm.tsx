"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { setupFirstUser } from "@/actions/auth";

export function SetupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await setupFirstUser(email, password);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/");
      } else {
        setError("Аккаунт создан, но не удалось войти. Попробуйте на странице входа.");
      }
    } catch {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg-secondary rounded-[28px] p-8 w-full max-w-[400px] candle-glow animate-[candleFlicker_3s_ease-in-out_infinite]">
      <div className="stagger-1 flex justify-center">
        <Logo size="lg" />
      </div>

      <div className="stagger-2 mt-6 text-center">
        <h2 className="font-display text-display-sm text-text-cream">
          Создание аккаунта
        </h2>
        <p className="font-body text-body-sm text-text-muted-light mt-2">
          Привет, Сабыржан! Создай аккаунт для нашего пространства
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="stagger-3">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="stagger-4">
          <Input
            id="password"
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Придумайте пароль"
            required
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text-accent-rose text-body-sm">{error}</p>
        )}

        <div className="stagger-5">
          <Button type="submit" fullWidth loading={loading}>
            Создать
          </Button>
        </div>
      </form>
    </div>
  );
}
