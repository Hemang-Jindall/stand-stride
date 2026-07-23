import type { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({
  children,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-slate-100 flex flex-col">
        {children}
      </div>
    </div>
  );
}