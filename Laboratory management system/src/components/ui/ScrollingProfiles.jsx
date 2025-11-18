import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

import labScientist1 from '../../assets/images/lab-scientist-1.jpg';
import labEquipment1 from '../../assets/images/lab-equipment-1.jpg';
import labTesting1 from '../../assets/images/lab-testing-1.jpg';
import labMicroscope1 from '../../assets/images/lab-microscope-1.jpg';
import labResearcher1 from '../../assets/images/lab-researcher-1.jpg';
import labSamples1 from '../../assets/images/lab-samples-1.jpg';
import labTechnician1 from '../../assets/images/lab-technician-1.jpg';

// Use 7 images to match the design shown in the image
const PROFILE_IMAGES = [
  labScientist1,
  labResearcher1,
  labMicroscope1,
  labSamples1,
  labTesting1,
  labEquipment1,
  labTechnician1,
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const ScrollingProfiles = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY || window.pageYOffset;

      // Start animation slightly before the section reaches the viewport
      const animationStart = sectionTop - viewportHeight * 0.5;
      const animationEnd = sectionTop + sectionHeight - viewportHeight * 0.5;
      const rawProgress = (scrollPosition - animationStart) / (animationEnd - animationStart);

      setProgress(clamp(rawProgress));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  // Apply easing for smoother motion
  const animationProgress = useMemo(() => {
    if (progress < 0.5) {
      return 2 * progress * progress;
    }
    return 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }, [progress]);

  // Final radius where images should be positioned (in pixels)
  const finalRadius = 260;
  const expandRadius = animationProgress * finalRadius;

  // Calculate scale: start at 0, end at 1
  const imageScale = useMemo(() => {
    if (animationProgress <= 0) return 0;
    if (animationProgress < 0.2) return animationProgress * 4.5;
    return 0.2 + (animationProgress - 0.2) * 1.05;
  }, [animationProgress]);

  // Opacity: fade in as images expand
  const imageOpacity = useMemo(() => clamp(animationProgress * 1.6), [animationProgress]);

  return (
    <section ref={sectionRef} className="relative min-h-[220vh] bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4">
        <div
          className={`relative flex items-center justify-center rounded-full transition-all duration-700 ${
            animationProgress > 0.35 ? 'border-2 border-white/15' : 'border border-white/5'
          }`}
          style={{ width: 600, height: 600 }}
        >
          <div
            className={`relative flex items-center justify-center rounded-full transition-all duration-700 ${
              animationProgress > 0.2 ? 'border-2 border-blue-300/25' : 'border border-white/5'
            }`}
            style={{ width: 500, height: 500 }}
          >
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500/60 via-blue-500/70 to-cyan-500/60 p-1">
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#020b18]/95">
                {/* Profile images - start at center, expand outward */}
                {PROFILE_IMAGES.map((src, index) => {
                  const angle = (index / PROFILE_IMAGES.length) * Math.PI * 2;
                  const translateX = expandRadius * Math.cos(angle);
                  const translateY = expandRadius * Math.sin(angle);

                  return (
                    <motion.div
                      key={`profile-${index}`}
                      className="absolute h-24 w-24 overflow-hidden rounded-2xl border-4 border-white/80 shadow-2xl md:h-28 md:w-28"
                      style={{
                        transform: `translate(${translateX}px, ${translateY}px) scale(${imageScale})`,
                        opacity: imageOpacity,
                        transformOrigin: 'center center',
                        zIndex: 30,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 70,
                        damping: 20,
                      }}
                    >
                      <img
                        src={src}
                        alt={`Lab specialist ${index + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  );
                })}

                {/* Connection lines - appear as images expand */}
                {PROFILE_IMAGES.map((_, index) => {
                  const angle = (index / PROFILE_IMAGES.length) * Math.PI * 2;
                  const lineLength = expandRadius;
                  const lineOpacity = clamp(animationProgress * 1.4, 0, 0.35);

                  return (
                    <div
                      key={`line-${index}`}
                      className="absolute pointer-events-none"
                      style={{
                        width: `${lineLength}px`,
                        height: '1px',
                        background: 'linear-gradient(to right, rgba(255,255,255,0.45), transparent)',
                        transform: `rotate(${angle}rad)`,
                        transformOrigin: '0 0',
                        opacity: lineOpacity,
                        left: '50%',
                        top: '50%',
                        zIndex: 2,
                      }}
                    />
                  );
                })}

                {/* Central content - fades in as scroll progresses */}
                <motion.div
                  className="relative z-10 flex max-w-sm flex-col items-center gap-3 text-center rounded-[28px] border border-white/10 bg-[#020b18]/85 px-6 py-6 shadow-[0_40px_90px_rgba(6,20,45,0.45)] backdrop-blur"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: animationProgress > 0.45 ? 1 : animationProgress * 2.2,
                    scale: animationProgress > 0.45 ? 1 : 0.9 + animationProgress * 0.25,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: animationProgress > 0.55 ? 1 : 0,
                      y: animationProgress > 0.55 ? 0 : 10,
                    }}
                  >
                    Trusted Network
                  </motion.span>
                  <motion.h2
                    className="text-4xl font-bold leading-tight text-white md:text-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: animationProgress > 0.65 ? 1 : 0,
                      y: animationProgress > 0.65 ? 0 : 20,
                    }}
                  >
                    Empowering Every Specialist
                  </motion.h2>
                  <motion.p
                    className="text-sm leading-relaxed text-white/70"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: animationProgress > 0.75 ? 1 : 0,
                      y: animationProgress > 0.75 ? 0 : 20,
                    }}
                  >
                    From clinicians to researchers, Linos LMS connects your entire laboratory team with precision workflows and
                    real-time insight.
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-cyan-500/20 blur-3xl" />
        </div>
      </div>

      {/* Bottom content section */}
      <div className="mx-auto max-w-4xl px-6 pb-32 pt-16 text-center text-white/70">
        <motion.h3
          className="text-3xl font-semibold text-white md:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          A global network of laboratories
        </motion.h3>
        <motion.p
          className="mt-6 text-base leading-relaxed md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Secure collaboration with teams worldwide. Scroll to see how our platform expands your impact across every role in the
          laboratory ecosystem.
        </motion.p>
      </div>
    </section>
  );
};

export default ScrollingProfiles;
