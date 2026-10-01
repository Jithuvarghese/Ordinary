import { readdirSync } from "node:fs";
import { join } from "node:path";
import Background from "@/components/Background";
import BusBell from "@/components/BusBell";
import ConductorButton from "@/components/ConductorButton";
import Player from "@/components/Player/Player";
import Title from "@/components/Title";
import OnboardPill from "@/components/OnboardPill";
import RouteTicker from "@/components/RouteTicker";
import TopBar from "@/components/TopBar";

/** Audio files dropped into public/sfx become conductor clips; read once at build time. */
function conductorClips(): string[] {
  try {
    return readdirSync(join(process.cwd(), "public", "sfx"))
      .filter((file) => /\.(mp3|ogg|wav|m4a|aac|webm)$/i.test(file))
      .sort()
      .map((file) => `/sfx/${encodeURIComponent(file)}`);
  } catch {
    return [];
  }
}

export default function Home() {
  const clips = conductorClips();

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <Background />
      <TopBar center={<OnboardPill />} />
      <RouteTicker />
      <Title />
      <ConductorButton clips={clips} />
      <BusBell />
      <Player />
    </main>
  );
}
