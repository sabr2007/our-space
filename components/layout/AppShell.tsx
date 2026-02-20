import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  daysText: string;
}

export default function AppShell({ children, daysText }: AppShellProps) {
  return (
    <>
      <TopBar daysText={daysText} />
      <main className="pt-16 pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </>
  );
}
