import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3HeroAnimated } from "../components/ui/AnimatedWeb3Landing";
import useAuthStore from "../store/authStore";

// Welcome page component - using animated Web3 landing page
export default function Welcome() {
  return <Web3HeroAnimated />;
}

