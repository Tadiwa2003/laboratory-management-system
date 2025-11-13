import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationContainer from './NotificationContainer';

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 dark:bg-[#050d1a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.25),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(226,232,240,0.55)_0%,rgba(241,245,249,0.1)_40%,transparent_70%)] dark:bg-[linear-gradient(140deg,rgba(30,64,175,0.28)_0%,rgba(8,47,73,0.3)_45%,transparent_80%)]" />

      <div className="relative z-10 flex min-h-screen w-full bg-white/35 backdrop-blur-[14px] dark:bg-[#030915]/65">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
            <div className="mx-auto w-full max-w-7xl space-y-8">
              <Outlet />
            </div>
          </main>
        </div>

        <NotificationContainer />
      </div>
    </div>
  );
};

export default DashboardLayout;

