import LandingNavbar from "../components/LandingNavbar";
import HeroV2 from "../components/HeroV2";
import TrustStats from "../components/TrustStats";
import WhySyncSpace from "../components/WhySyncSpace";
import EverythingInOne from "../components/EverythingInOne";
import PowerfulFeatures from "../components/PowerfulFeatures";
import HowItWorks from "../components/HowItWorks";
import BuiltForEveryone from "../components/BuiltForEveryone";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#090909] selection:bg-violet-500/30 font-sans antialiased text-zinc-200">
      <LandingNavbar />

      <HeroV2 />

      <TrustStats />

      <WhySyncSpace />

      <EverythingInOne />

      <PowerfulFeatures />

      <HowItWorks />

      <BuiltForEveryone />

      <FAQ />

      <FinalCTA />

      <Footer />
    </main>
  );
}