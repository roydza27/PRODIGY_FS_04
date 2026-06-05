import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import WorkspaceShowcase from "../components/WorkspaceShowcase";
import RoomsShowcase from "../components/RoomsShowcase";
import RealtimeSection from "../components/RealtimeSection";

export default function HomePage() {
  return (
    <main className="bg-[#111113]">
      <LandingNavbar />

      <HeroSection />

      <StatsSection />

      <WorkspaceShowcase />

      <RoomsShowcase />

      <RealtimeSection />
    </main>
  );
}