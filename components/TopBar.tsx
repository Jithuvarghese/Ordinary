import type { ReactNode } from "react";
import Clock from "./Clock";
import TopLinks from "./TopLinks";

export default function TopBar({ center }: { center?: ReactNode }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-7 sm:pt-6">
      <div className="justify-self-start">
        <Clock />
      </div>
      <div className="justify-self-center">{center}</div>
      <div className="justify-self-end">
        <TopLinks />
      </div>
    </header>
  );
}
