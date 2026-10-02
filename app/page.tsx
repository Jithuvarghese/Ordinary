import Background from "@/components/Background";
import Player from "@/components/Player/Player";
import Title from "@/components/Title";
import OnboardPill from "@/components/OnboardPill";
import RouteTicker from "@/components/RouteTicker";
import TopBar from "@/components/TopBar";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <Background />
      <TopBar center={<OnboardPill />} />
      <RouteTicker />
      <Title />
      <Player />
    </main>
  );
}
