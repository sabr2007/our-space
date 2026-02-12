import Link from "next/link";
import { db } from "@/lib/db";
import { Logo } from "@/components/ui/Logo";
import { InviteForm } from "./InviteForm";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const couple = await db.couple.findUnique({
    where: { inviteToken: token },
  });

  if (!couple) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="stagger-1">
          <Logo size="lg" />
        </div>
        <p className="font-body text-text-cream text-lg stagger-2">
          Ссылка недействительна
        </p>
        <p className="font-body text-text-muted-light text-base stagger-3">
          Эта ссылка уже была использована или не существует.
        </p>
        <Link
          href="/login"
          className="text-accent-gold hover:text-accent-gold-light font-ui text-[15px] hover:underline transition-colors duration-200 stagger-4"
        >
          Перейти к входу
        </Link>
      </div>
    );
  }

  const inviter = await db.user.findUnique({
    where: { id: couple.user1Id },
    select: { name: true },
  });

  return <InviteForm token={token} inviterName={inviter?.name ?? "Партнёр"} />;
}
