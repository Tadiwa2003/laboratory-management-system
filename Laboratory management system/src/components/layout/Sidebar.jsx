import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  User, 
  FlaskConical, 
  ClipboardList, 
  FileText,
  ShoppingCart,
  FileCheck,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { cn } from '../../utils/cn';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['all'] },
  { path: '/users', label: 'Users', icon: Users, roles: ['Lab Administrator'] },
  { path: '/patients', label: 'Patients', icon: User, roles: ['Reception Staff', 'Healthcare Provider', 'Lab Administrator'] },
  { path: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['Lab Technician', 'Lab Supervisor', 'Lab Administrator', 'Reception Staff'] },
  { path: '/specimens', label: 'Specimens', icon: FlaskConical, roles: ['Specimen Collector', 'Lab Technician', 'Lab Administrator'] },
  { path: '/tests', label: 'Tests', icon: ClipboardList, roles: ['Lab Technician', 'Lab Supervisor', 'Lab Administrator'] },
  { path: '/results', label: 'Results', icon: FileText, roles: ['Lab Technician', 'Lab Supervisor', 'Healthcare Provider', 'Lab Administrator'] },
  { path: '/reports', label: 'Reports', icon: FileCheck, roles: ['Lab Technician', 'Lab Supervisor', 'Healthcare Provider', 'Lab Administrator'] },
  { path: '/settings', label: 'Settings', icon: Settings, roles: ['all'] },
];

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuthStore();
  const userRole = user?.role || '';

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center rounded-xl border border-white/40 bg-white/80 p-2 shadow-lg shadow-slate-900/20 backdrop-blur dark:border-white/10 dark:bg-[#0f1a2b]/80"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/50 bg-white/85 shadow-[0_25px_60px_rgba(15,23,42,0.15)] backdrop-blur-2xl transition-transform duration-300 dark:border-white/10 dark:bg-[#0c162a]/80 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="border-b border-white/60 p-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/90 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/35">
              L
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Linos LMS
              </h1>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                Laboratory Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-4 py-3 text-[0.95rem] font-medium tracking-tight transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/30'
                      : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                  )
                }
              >
                <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-white/50 p-5 dark:border-white/10">
          <div className="flex items-center gap-3 rounded-2xl bg-white/75 p-3 shadow-inner shadow-slate-900/5 backdrop-blur-md dark:bg-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30">
              <span className="text-base font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.name || 'User'}
              </p>
              <p className="truncate text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                {userRole || 'Team'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

