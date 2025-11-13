import { IoNotifications, IoMoon, IoSunny, IoLogOut, IoPerson } from 'react-icons/io5';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="relative z-20 border-b border-white/45 bg-white/85 px-6 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0f1829]/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30 md:flex">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back, {user?.name || 'User'}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/70 text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            <IoNotifications className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/70 text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
          >
            {darkMode ? <IoSunny className="w-6 h-6" /> : <IoMoon className="w-6 h-6" />}
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/70 px-2 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 dark:border-white/10 dark:bg-white/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 shadow-inner shadow-white/40 dark:bg-primary-900 dark:text-primary-300">
                <span className="text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/40 bg-white/95 p-2 shadow-xl shadow-slate-900/15 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1829]/95">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <IoPerson className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <IoLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

