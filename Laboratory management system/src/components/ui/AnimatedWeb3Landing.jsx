import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import useAuthStore from "../../store/authStore";
import { KineticTypographyLoader } from "./KineticTypographyLoader";
import Modal from "../common/Modal";
import GradientTracing from "./GradientTracing";
import ScrollingProfiles from "./ScrollingProfiles";
import { AnimatedCard, CardBody, CardTitle, CardDescription, CardVisual, DocVisual } from "./AnimatedCard";
import { BookOpen, FileText, Code, CheckCircle, HelpCircle, AlertCircle } from "lucide-react";

export function Web3HeroAnimated() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const testimonialCards = [
    {
      quote: "Linos LMS gives our clinical teams a single, unified view of patients and specimens. We’ve reduced manual reconciliation by 42% in just three months.",
      name: "Dr. Amara Ndlovu",
      title: "Director of Clinical Operations",
      organization: "Meridian Diagnostics",
      image: "https://images.unsplash.com/photo-1583912268185-9ff71b8b0a85?auto=format&fit=crop&w=900&q=80",
      layout: "lg:col-span-2 lg:row-span-2",
      accent: "from-sky-500/40 via-blue-500/30 to-cyan-500/50",
    },
    {
      quote: "Automated specimen tracking has given us real-time visibility across all laboratory benches—no more hunting through spreadsheets.",
      name: "Jacob Lee",
      title: "Lead Laboratory Technologist",
      organization: "NovaPath Laboratories",
      image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&w=640&q=80",
      layout: "lg:col-span-1",
      accent: "from-indigo-500/40 to-blue-600/40",
    },
    {
      quote: "Role-based access keeps regulatory compliance effortless, even as our testing volume has doubled this year.",
      name: "Sara Thompson",
      title: "Quality & Compliance Manager",
      organization: "Precision BioLabs",
      image: "https://images.unsplash.com/photo-1581599845329-9270ee07a840?auto=format&fit=crop&w=640&q=80",
      layout: "lg:col-span-1",
      accent: "from-emerald-500/35 to-teal-500/40",
    },
    {
      quote: "Turnaround time for oncology panels dropped by 28% because dashboards surface exactly what our scientists need next.",
      name: "Miguel Ortega",
      title: "Senior Molecular Scientist",
      organization: "HelixGen Institute",
      image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=640&q=80",
      layout: "lg:col-span-1",
      accent: "from-rose-500/30 to-purple-500/40",
    },
    {
      quote: "The analytics widgets highlight bottle-necks in seconds; we finally have confidence in our daily throughput forecasts.",
      name: "Priya Raman",
      title: "Laboratory Operations Lead",
      organization: "Clarity Clinical",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=640&q=80",
      layout: "lg:col-span-1",
      accent: "from-amber-500/30 to-orange-500/40",
    },
    {
      quote: "Secure audit trails make collaborating with external research partners seamless while keeping PHI protected.",
      name: "Dr. Eleni Stavros",
      title: "Chief Research Officer",
      organization: "Aether Biotech",
      image: "https://images.unsplash.com/photo-1559757175-5700dde6756b?auto=format&fit=crop&w=640&q=80",
      layout: "lg:col-span-1",
      accent: "from-fuchsia-500/30 to-sky-500/30",
    },
  ];
  const testimonialVariants = {
    hidden: { opacity: 0, y: 32, filter: "blur(14px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };
  
  // Symmetric pillar heights (percent). Tall at edges, low at center.
  const pillars = [92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92];

  // State to trigger animations once the component is mounted.
  const [isMounted, setIsMounted] = useState(false);
  
  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  useEffect(() => {
    // Set isMounted to true after a short delay to allow the component to render first.
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const DOC_CARDS = [
    {
      title: "Getting Started",
      desc: "Launch your first site and onboard teams in less than 48 hours.",
      key: "getting-started",
      icon: BookOpen,
      gradient: "from-[#007C91]/15 to-[#00B8D4]/15",
      mainColor: "#007C91",
      secondaryColor: "#00B8D4",
    },
    {
      title: "User Guide",
      desc: "Comprehensive guide to all features",
      key: "user-guide",
      icon: FileText,
      gradient: "from-purple-500/40 to-pink-500/40",
      mainColor: "#a855f7",
      secondaryColor: "#ec4899"
    },
    {
      title: "API Documentation",
      desc: "Technical documentation for developers",
      key: "api-docs",
      icon: Code,
      gradient: "from-green-500/40 to-emerald-500/40",
      mainColor: "#22c55e",
      secondaryColor: "#10b981"
    },
    {
      title: "Best Practices",
      desc: "Tips and best practices for optimal usage",
      key: "best-practices",
      icon: CheckCircle,
      gradient: "from-yellow-500/40 to-orange-500/40",
      mainColor: "#eab308",
      secondaryColor: "#f97316"
    },
    {
      title: "Troubleshooting",
      desc: "Common issues and solutions",
      key: "troubleshooting",
      icon: AlertCircle,
      gradient: "from-red-500/40 to-rose-500/40",
      mainColor: "#ef4444",
      secondaryColor: "#f43f5e"
    },
    {
      title: "FAQ",
      desc: "Frequently asked questions",
      key: "faq",
      icon: HelpCircle,
      gradient: "from-indigo-500/40 to-blue-500/40",
      mainColor: "#6366f1",
      secondaryColor: "#3b82f6"
    },
  ];

  return (
    <ReactLenis root>
      <div className="relative w-full text-white">
        {/* Kinetic Typography Loader Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6">
              <KineticTypographyLoader />
            </div>
          </div>
        )}
        
        <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes subtlePulse {
            0%, 100% {
              opacity: 0.8;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.03);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
        </style>

        <section className="relative isolate h-screen overflow-hidden bg-black text-white">
          {/* Gradient tracers */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <GradientTracing
              width={480}
              height={220}
              className="hidden md:block absolute top-28 left-16 opacity-40"
              gradientColors={["#38BDF8", "#60A5FA", "#A855F7"]}
              strokeWidth={4}
            />
            <GradientTracing
              width={360}
              height={180}
              className="absolute bottom-24 right-24 opacity-35"
              gradientColors={["#93C5FD", "#2DD4BF", "#38BDF8"]}
              strokeWidth={3}
              animationDuration={4}
            />
            <GradientTracing
              width={320}
              height={160}
              className="hidden lg:block absolute top-1/3 right-1/3 opacity-30"
              gradientColors={["#F472B6", "#C084FC", "#38BDF8"]}
              strokeWidth={2.5}
              animationDuration={5}
              path={`M10,${160 / 2} C120,10 200,150 310,${160 / 2}`}
            />
          </div>
          {/* ================== BACKGROUND ================== */}
          {/* Luminous elliptical gradients */}
          <div
            aria-hidden
            className="absolute inset-0 -z-30"
            style={{
              backgroundImage: [
                // Main central dome/band
                "radial-gradient(80% 55% at 50% 52%, rgba(14,165,233,0.45) 0%, rgba(2,132,199,0.46) 27%, rgba(3,105,161,0.38) 47%, rgba(7,89,133,0.45) 60%, rgba(12,74,110,0.92) 78%, rgba(0,0,0,1) 88%)",
                // Warm sweep from top-left
                "radial-gradient(85% 60% at 14% 0%, rgba(56,189,248,0.65) 0%, rgba(14,165,233,0.58) 30%, rgba(48,24,28,0.0) 64%)",
                // Cool rim on top-right
                "radial-gradient(70% 50% at 86% 22%, rgba(59,130,246,0.40) 0%, rgba(16,18,28,0.0) 55%)",
                // Soft top vignette
                "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%)",
              ].join(","),
              backgroundColor: "#000",
            }}
          />

          {/* Vignette corners for extra contrast */}
          <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(140%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,0.85))]" />

          {/* Grid overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-30"
            style={{
              backgroundImage: [
                // Vertical grid lines
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 96px)",
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 24px)",
                // Curved horizontal arcs
                "repeating-radial-gradient(80% 55% at 50% 52%, rgba(255,255,255,0.08) 0 1px, transparent 1px 120px)"
              ].join(","),
              backgroundBlendMode: "screen",
            }}
          />

          {/* ================== NAV ================== */}
          <header className="relative z-10">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-500" />
                <span className="text-lg font-semibold tracking-tight">Linos LMS</span>
              </div>

              <nav className="hidden items-center gap-8 text-sm/6 text-white/80 md:flex">
                {['Features','Testimonials','About','Contact','Docs'].map((i)=>(
                  <a 
                    key={i} 
                    className="hover:text-white transition-colors cursor-pointer" 
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById(i.toLowerCase());
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {i}
                  </a>
                ))}
              </nav>

              <div className="hidden items-center gap-3 md:flex">
                <button 
                  onClick={() => navigate('/login')}
                  className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <button 
                  onClick={handleGetStarted}
                  disabled={loading}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-white/90 disabled:opacity-50"
                >
                  Get Started
                </button>
              </div>

              <button className="md:hidden rounded-full bg-white/10 px-3 py-2 text-sm">Menu</button>
            </div>
          </header>

          {/* ================== COPY ================== */}
          <div className="relative z-10 mx-auto grid w-full max-w-5xl place-items-center px-6 py-16 md:py-24 lg:py-28">
            <div className={`mx-auto text-center ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70 ring-1 ring-white/10 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400" /> Laboratory Management System
              </span>
              <h1 
                style={{ animationDelay: '200ms' }} 
                className={`mt-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}
              >
                Streamline Your Laboratory Operations
              </h1>
              <p 
                style={{ animationDelay: '300ms' }} 
                className={`mx-auto mt-5 max-w-2xl text-balance text-white/80 md:text-lg lg:text-xl ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}
              >
                Manage patients, specimens, tests, and results all in one place with an intuitive, modern interface designed for efficiency and excellence.
              </p>
              <div 
                style={{ animationDelay: '400ms' }} 
                className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}
              >
                <button 
                  onClick={handleGetStarted}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow transition hover:bg-white/90 disabled:opacity-50"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:border-white/40 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* ================== PARTNERS/TRUST ================== */}
          <div className="relative z-10 mx-auto mt-10 w-full max-w-6xl px-6 pb-24">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
              {["HIPAA Compliant","ISO Certified","Secure","Reliable","Modern","Efficient"].map((brand) => (
                <div key={brand} className="text-xs uppercase tracking-wider text-white/70">{brand}</div>
              ))}
            </div>
          </div>

          {/* ================== FOREGROUND ================== */}
          {/* Center-bottom rectangular glow with pulse animation */}
          <div
            className="pointer-events-none absolute bottom-[128px] left-1/2 z-0 h-36 w-28 -translate-x-1/2 rounded-md bg-gradient-to-b from-primary-400/75 via-primary-500/60 to-transparent"
            style={{ animation: 'subtlePulse 6s ease-in-out infinite' }}
          />

          {/* Stepped pillars silhouette */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[54vh]">
            {/* dark fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
            {/* bars */}
            <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-px px-[2px]">
              {pillars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-black transition-all duration-1000 ease-in-out"
                  style={{
                    height: isMounted ? `${h}%` : '0%',
                    transitionDelay: `${Math.abs(i - Math.floor(pillars.length / 2)) * 60}ms`
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================== SECTIONS ================== */}
        {/* Features Section */}
        <section id="features" className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Features</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Everything you need to manage your laboratory efficiently
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Patient Management', desc: 'Comprehensive patient records and history tracking' },
                { title: 'Specimen Tracking', desc: 'Track specimens from collection to analysis' },
                { title: 'Test Processing', desc: 'Streamlined workflow for test processing and results' },
                { title: 'Result Management', desc: 'Organize and manage test results efficiently' },
                { title: 'User Management', desc: 'Role-based access control and user administration' },
                { title: 'Reporting', desc: 'Generate detailed reports and analytics' },
              ].map((feature, idx) => (
                <div 
                  key={feature.title}
                  className="group p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-20 px-6">
          <GradientTracing
            width={420}
            height={200}
            className="hidden lg:block absolute -top-12 left-1/4 opacity-30"
            gradientColors={["#34D399", "#38BDF8", "#14B8A6"]}
            strokeWidth={3}
            animationDuration={4.5}
          />
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">About</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Modern laboratory management for the digital age
              </p>
            </div>
            <div className="max-w-4xl mx-auto space-y-8 text-center">
              <p className="text-lg text-white/80 leading-relaxed">
                Linos Laboratory Management System is a comprehensive solution designed to streamline 
                laboratory operations, improve efficiency, and ensure accuracy in patient care and testing processes.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Built with modern technology and best practices, our system provides a secure, reliable, 
                and user-friendly platform for managing all aspects of laboratory operations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  { stat: '99.9%', label: 'Uptime' },
                  { stat: 'HIPAA', label: 'Compliant' },
                  { stat: '24/7', label: 'Support' },
                ].map((item) => (
                  <div key={item.label} className="p-6 rounded-lg bg-white/5 backdrop-blur border border-white/10">
                    <div className="text-4xl font-bold mb-2">{item.stat}</div>
                    <div className="text-white/70">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Get in touch with our team
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-white/70">support@linoslms.com</p>
                </div>
                <div className="p-6 rounded-lg bg-white/5 backdrop-blur border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">Phone</h3>
                  <p className="text-white/70">+1 (555) 123-4567</p>
                </div>
              </div>
              <form 
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for your message! We will get back to you soon.');
                }}
              >
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Your Message" 
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow transition hover:bg-white/90"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Docs Section */}
        <section id="docs" className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-20 px-6">
          <GradientTracing
            width={360}
            height={180}
            className="hidden md:block absolute top-12 right-16 opacity-25"
            gradientColors={["#F87171", "#FBBF24", "#FB7185"]}
            strokeWidth={3}
            animationDuration={3.5}
          />
          <GradientTracing
            width={300}
            height={150}
            className="absolute bottom-16 left-12 opacity-20"
            gradientColors={["#38BDF8", "#C084FC", "#F472B6"]}
            strokeWidth={2.5}
            animationDuration={4.2}
          />
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Learn how to use Linos LMS effectively
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {DOC_CARDS.map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <motion.div
                    key={doc.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                  >
                  <AnimatedCard
                    onClick={() => setSelectedDoc(doc.key)}
                    className="cursor-pointer"
                  >
                    <CardVisual>
                      <DocVisual 
                        mainColor={doc.mainColor}
                        secondaryColor={doc.secondaryColor}
                        icon={Icon}
                        gradient={doc.gradient}
                      />
                    </CardVisual>
                    <CardBody>
                      <CardTitle>{doc.title}</CardTitle>
                      <CardDescription>{doc.desc}</CardDescription>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(doc.key);
                        }}
                        className="mt-4 text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1 group-hover/animated-card:gap-2"
                      >
                        Read More 
                        <span className="transition-transform group-hover/animated-card:translate-x-1">→</span>
                      </button>
                    </CardBody>
                  </AnimatedCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Documentation Modal */}
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={getDocTitle(selectedDoc)}
          size="xl"
        >
          {getDocContent(selectedDoc)}
        </Modal>
        <ScrollingProfiles />
      </div>
    </ReactLenis>
  );
}

// Documentation content helper functions
function getDocTitle(key) {
  const titles = {
    'getting-started': 'Getting Started',
    'user-guide': 'User Guide',
    'api-docs': 'API Documentation',
    'best-practices': 'Best Practices',
    'troubleshooting': 'Troubleshooting',
    'faq': 'Frequently Asked Questions'
  };
  return titles[key] || 'Documentation';
}

function getDocContent(key) {
  const content = {
    'getting-started': (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome to Linos LMS</h3>
          <p className="mb-4">
            Linos Laboratory Management System is designed to streamline your laboratory operations. 
            This guide will help you get started quickly.
          </p>
        </div>
        
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Account Setup</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Contact your system administrator to create your account</li>
            <li>You will receive login credentials via email</li>
            <li>First-time login will prompt you to change your password</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Navigation</h4>
          <p className="mb-2">The sidebar provides access to all major features:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Dashboard:</strong> Overview of your laboratory metrics</li>
            <li><strong>Patients:</strong> Manage patient records</li>
            <li><strong>Specimens:</strong> Track specimen collections</li>
            <li><strong>Tests:</strong> Process laboratory tests</li>
            <li><strong>Results:</strong> View and manage test results</li>
            <li><strong>Reports:</strong> Generate analytical reports</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Your First Steps</h4>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Familiarize yourself with the dashboard</li>
            <li>Review your user profile and settings</li>
            <li>Explore the patient management section</li>
            <li>Practice creating a test order</li>
          </ol>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Use the search functionality in each section to quickly find records. 
            Keyboard shortcuts are available - press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">?</kbd> to view them.
          </p>
        </div>
      </div>
    ),
    
    'user-guide': (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Comprehensive User Guide</h3>
          <p className="mb-4">
            This guide covers all features and functionalities of Linos LMS.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Patient Management</h4>
          <p className="mb-2">Manage patient records efficiently:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Register new patients with complete demographic information</li>
            <li>Search and filter patients by name, ID, or date</li>
            <li>View patient history and previous test results</li>
            <li>Update patient information as needed</li>
            <li>Export patient data for reporting purposes</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Specimen Tracking</h4>
          <p className="mb-2">Track specimens from collection to analysis:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Record specimen collection with timestamps</li>
            <li>Assign unique specimen IDs for tracking</li>
            <li>Monitor specimen status (collected, in transit, received, processed)</li>
            <li>Link specimens to patient records and test orders</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Test Processing</h4>
          <p className="mb-2">Streamline your testing workflow:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Create test orders linked to patients and specimens</li>
            <li>Assign tests to laboratory technicians</li>
            <li>Track test progress through various stages</li>
            <li>Set priority levels for urgent tests</li>
            <li>View pending and completed tests</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Result Management</h4>
          <p className="mb-2">Manage test results effectively:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Enter test results with values and units</li>
            <li>Compare results against reference ranges</li>
            <li>Flag abnormal results for review</li>
            <li>Approve results before finalization</li>
            <li>Generate result reports for patients</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Reporting</h4>
          <p className="mb-2">Generate comprehensive reports:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Create custom date range reports</li>
            <li>Export reports in multiple formats (PDF, Excel, CSV)</li>
            <li>View statistical summaries and trends</li>
            <li>Schedule automated report generation</li>
          </ul>
        </div>
      </div>
    ),

    'api-docs': (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">API Documentation</h3>
          <p className="mb-4">
            Technical documentation for developers integrating with Linos LMS.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Authentication</h4>
          <p className="mb-2">All API requests require authentication using Bearer tokens:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>{`Authorization: Bearer <your-token>`}</code>
          </pre>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Base URL</h4>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>{`https://api.linoslms.com/v1`}</code>
          </pre>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Endpoints</h4>
          <div className="space-y-4">
            <div>
              <p className="font-mono text-sm mb-1"><span className="text-green-600 dark:text-green-400">GET</span> /patients</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Retrieve list of patients</p>
            </div>
            <div>
              <p className="font-mono text-sm mb-1"><span className="text-blue-600 dark:text-blue-400">POST</span> /patients</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create a new patient record</p>
            </div>
            <div>
              <p className="font-mono text-sm mb-1"><span className="text-yellow-600 dark:text-yellow-400">PUT</span> /patients/:id</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update patient information</p>
            </div>
            <div>
              <p className="font-mono text-sm mb-1"><span className="text-red-600 dark:text-red-400">DELETE</span> /patients/:id</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Delete a patient record</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Response Format</h4>
          <p className="mb-2">All responses are in JSON format:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}`}</code>
          </pre>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> For complete API documentation, please contact your system administrator 
            or visit our developer portal at <a href="#" className="underline">docs.linoslms.com</a>
          </p>
        </div>
      </div>
    ),

    'best-practices': (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Best Practices</h3>
          <p className="mb-4">
            Follow these guidelines to ensure optimal usage of Linos LMS.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Data Entry</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Always verify patient information before creating records</li>
            <li>Use standardized naming conventions for consistency</li>
            <li>Double-check specimen IDs to avoid mismatches</li>
            <li>Enter complete information to ensure accurate reporting</li>
            <li>Review data before final submission</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Security</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Never share your login credentials</li>
            <li>Log out when finished, especially on shared computers</li>
            <li>Use strong, unique passwords</li>
            <li>Report any suspicious activity immediately</li>
            <li>Follow HIPAA compliance guidelines</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Workflow Efficiency</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Use keyboard shortcuts to speed up navigation</li>
            <li>Set up filters and saved searches for frequently accessed data</li>
            <li>Batch process similar tasks together</li>
            <li>Utilize the dashboard for quick overviews</li>
            <li>Regularly review and update patient information</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Quality Control</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Verify test results before approval</li>
            <li>Cross-reference with patient history when needed</li>
            <li>Flag abnormal results for physician review</li>
            <li>Maintain accurate audit trails</li>
            <li>Regularly backup important data</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200">
            <strong>Remember:</strong> Consistent use of these practices ensures data accuracy, 
            improves workflow efficiency, and maintains compliance with regulatory requirements.
          </p>
        </div>
      </div>
    ),

    'troubleshooting': (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Troubleshooting Guide</h3>
          <p className="mb-4">
            Common issues and their solutions.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Login Issues</h4>
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">Cannot log in</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Verify your username and password are correct</li>
                <li>Check if Caps Lock is enabled</li>
                <li>Clear browser cache and cookies</li>
                <li>Try a different browser</li>
                <li>Contact administrator if account is locked</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Data Not Loading</h4>
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">Slow performance or timeout</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Check your internet connection</li>
                <li>Reduce the date range in filters</li>
                <li>Clear browser cache</li>
                <li>Close unnecessary browser tabs</li>
                <li>Try refreshing the page</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Form Submission Errors</h4>
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">Cannot save data</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Verify all required fields are filled</li>
                <li>Check for validation error messages</li>
                <li>Ensure data format is correct (dates, numbers, etc.)</li>
                <li>Try saving again after a few moments</li>
                <li>Contact support if issue persists</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Display Issues</h4>
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">Page not displaying correctly</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Update your browser to the latest version</li>
                <li>Disable browser extensions temporarily</li>
                <li>Check browser zoom level (should be 100%)</li>
                <li>Try incognito/private browsing mode</li>
                <li>Clear browser cache and reload</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200">
            <strong>Still having issues?</strong> Contact support at{' '}
            <a href="mailto:support@linoslms.com" className="underline">support@linoslms.com</a> 
            {' '}or call +1 (555) 123-4567
          </p>
        </div>
      </div>
    ),

    'faq': (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Q: How do I reset my password?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              A: Click on "Forgot Password" on the login page and follow the instructions sent to your email. 
              If you don't receive the email, contact your system administrator.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Q: Can I export patient data?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              A: Yes, you can export patient data in various formats (PDF, Excel, CSV) from the Reports section. 
              Ensure you have the appropriate permissions for data export.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Q: How do I add a new test type?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              A: Test types are managed by system administrators. Contact your administrator to add new test types 
              or modify existing ones.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Q: What browsers are supported?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              A: Linos LMS supports the latest versions of Chrome, Firefox, Safari, and Edge. 
              We recommend using Chrome for the best experience.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Q: How do I print test results?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              A: Navigate to the Results section, select the result you want to print, and click the "Print" button. 
              You can also generate PDF reports from the Reports section.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Q: Can multiple users work on the same record?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              A: The system uses a locking mechanism to prevent conflicts. When one user is editing a record, 
              others will see it as locked until the first user saves or cancels.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Q: How long is data retained?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              A: Data retention follows HIPAA guidelines and your organization's policies. 
              Contact your administrator for specific retention periods.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Have more questions?</strong> Visit our support portal or contact us at{' '}
            <a href="mailto:support@linoslms.com" className="underline">support@linoslms.com</a>
          </p>
        </div>
      </div>
    )
  };
  
  return content[key] || <p>Documentation not found.</p>;
}

export default Web3HeroAnimated;

