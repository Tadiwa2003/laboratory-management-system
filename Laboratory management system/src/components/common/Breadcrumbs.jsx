import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (path) => {
    const names = {
      dashboard: 'Dashboard',
      users: 'Users',
      patients: 'Patients',
      orders: 'Orders',
      specimens: 'Specimens',
      tests: 'Tests',
      results: 'Results',
      settings: 'Settings',
      profile: 'Profile',
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <div key={routeTo} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {getBreadcrumbName(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {getBreadcrumbName(name)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

