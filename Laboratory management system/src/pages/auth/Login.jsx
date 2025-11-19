import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import useThemeStore from '../../store/themeStore';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { KineticTypographyLoader } from '../../components/ui/KineticTypographyLoader';
import SignInCanvasBackground from '../../components/ui/SignInCanvasBackground';
import mockDataService from '../../services/mockData';
import { IoFlask, IoLogoGithub, IoLogoDiscord, IoLogoLinkedin } from 'react-icons/io5';
import { cn } from '../../utils/cn';

const FloatingNav = () => {
  const navigate = useNavigate();
  const links = [
    { label: 'Overview', href: '#' },
    { label: 'Docs', href: '#' },
  ];

  return (
    <div className="pointer-events-none absolute top-8 left-1/2 z-40 flex w-[min(90vw,780px)] -translate-x-1/2 items-center justify-between rounded-full border border-white/10 bg-white/10 px-6 py-3 backdrop-blur-xl">
      <div className="pointer-events-auto flex items-center gap-2 text-white/80">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
          <IoFlask className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Linos LMS</p>
          <p className="text-xs text-white/60">Laboratory Platform</p>
        </div>
      </div>
      <div className="pointer-events-auto hidden items-center gap-5 text-xs font-medium text-white/60 md:flex">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="transition-colors hover:text-white">
            {link.label}
          </a>
        ))}
      </div>
      <div className="pointer-events-auto hidden items-center gap-3 md:flex">
        <button className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:text-white">
          Docs
        </button>
        <button
          onClick={() => navigate('/contact')}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-900 shadow-md transition-colors hover:bg-blue-100"
        >
          Contact
        </button>
      </div>
    </div>
  );
};

const AnimatedInput = ({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  validation,
  error,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const field = register(name, validation);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <div
        className="relative"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input
          {...field}
          id={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            'relative z-10 w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white transition-all duration-200 placeholder:text-white/40 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40',
            error && 'border-red-400/80 focus:ring-red-300/40'
          )}
        />
        {isHovering && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
            style={{
              background: `radial-gradient(140px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(96,165,250,0.35), transparent 70%)`,
            }}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-300">{error.message}</p>
      )}
    </div>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [panelHover, setPanelHover] = useState(false);
  const [panelMouse, setPanelMouse] = useState({ x: 0, y: 0 });
  const { login } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { setDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setDarkMode(theme.state?.darkMode || false);
      } catch (e) {
        console.error('Error loading theme:', e);
      }
    }
  }, [setDarkMode]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3200));

      const users = mockDataService.getUsers();
      const user = users.find((u) => u.email === data.email && u.password === data.password);

      if (user) {
        const { password, ...userWithoutPassword } = user;
        login(userWithoutPassword, 'mock-token');
        mockDataService.addAuditLog('LOGIN', user.id, { email: user.email });

        await new Promise((resolve) => setTimeout(resolve, 900));

        addNotification({ message: 'Login successful!', type: 'success' });
        navigate('/dashboard', { replace: true });
      } else {
        setLoading(false);
        addNotification({ message: 'Invalid email or password', type: 'error' });
      }
    } catch (error) {
      setLoading(false);
      addNotification({ message: 'Login failed. Please try again.', type: 'error' });
    }
  };

  const socials = [
    { name: 'Discord', icon: IoLogoDiscord },
    { name: 'Github', icon: IoLogoGithub },
    { name: 'LinkedIn', icon: IoLogoLinkedin },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020b18] p-4 text-white">
      <SignInCanvasBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-slate-950/40 to-[#020b18]/80" />
      <FloatingNav />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6">
            <KineticTypographyLoader />
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: loading ? 0.35 : 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-30 w-full max-w-5xl"
      >
        <div className="grid gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_35px_80px_rgba(5,25,45,0.55)] backdrop-blur-2xl md:grid-cols-[1.05fr_0.95fr]">
          <div
            className="relative flex h-full flex-col justify-between px-6 py-10 md:px-12"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPanelMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseEnter={() => setPanelHover(true)}
            onMouseLeave={() => setPanelHover(false)}
          >
            <div
              className={cn(
                'pointer-events-none absolute top-16 left-16 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/30 blur-[120px] transition-opacity duration-300',
                panelHover ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transform: `translate(${panelMouse.x}px, ${panelMouse.y}px)` }}
            />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-200">
                  <IoFlask className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">Linos LMS</h1>
                  <p className="text-sm text-white/70">Laboratory Management System</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-white/70">
                <h2 className="text-3xl font-bold text-white">Precision for every lab team</h2>
                <p className="text-sm leading-relaxed">
                  Streamline diagnostics, automate reporting, and keep every stakeholder aligned across your laboratory ecosystem.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {socials.map(({ name, icon: Icon }) => (
                  <a
                    key={name}
                    href="#"
                    className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:scale-105"
                  >
                    <span className="absolute inset-0 translate-y-full bg-gradient-to-br from-blue-500/60 via-sky-400/50 to-cyan-300/40 transition-transform duration-500 group-hover:translate-y-0" />
                    <Icon className="relative z-10 h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-10 text-xs text-white/60">
              Need access? <a href="#" className="text-blue-300">Request credentials</a>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-blue-500/10 to-transparent" />
            <div className="relative h-full w-full bg-slate-900/20 px-6 py-10 md:px-12">
              <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col gap-6">
                <AnimatedInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="admin@linoslms.com"
                  register={register}
                  validation={{ required: 'Email is required' }}
                  error={errors.email}
                />

                <AnimatedInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  register={register}
                  validation={{ required: 'Password is required' }}
                  error={errors.password}
                />

                <div className="flex items-center justify-between text-xs text-white/60">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-300">Forgot password?</a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="group relative mt-2 w-full overflow-hidden rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader size="sm" />
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
                      Sign In
                    </span>
                  )}
                  <span className="absolute inset-0 translate-x-[-120%] bg-white/20 opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-100" />
                </Button>

                <p className="text-xs text-white/55">
                  By continuing, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

