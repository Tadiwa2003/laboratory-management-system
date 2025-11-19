import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3HeroAnimated } from "../components/ui/AnimatedWeb3Landing";
import useAuthStore from "../store/authStore";
import Footer from "../components/layout/Footer";
import { WavyBackground } from "../components/ui/WavyBackground";

// Welcome page component - using animated Web3 landing page with full-page background animation
export default function Welcome() {
  return (
    <div className="min-h-screen relative">
      {/* Full page background animation */}
      <div className="fixed inset-0 z-0">
        <WavyBackground
          colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
          waveWidth={60}
          backgroundFill="linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)"
          blur={8}
          speed="fast"
          waveOpacity={0.3}
          containerClassName="h-full w-full"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        <Web3HeroAnimated />
        <Footer />
      </div>
    </div>
  );
}

