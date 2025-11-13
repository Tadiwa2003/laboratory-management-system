import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Database } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import useThemeStore from '../../store/themeStore';
import mockDataService from '../../services/mockData';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [permissions, setPermissions] = useState({
    viewReports: true,
    editPatients: true,
    manageUsers: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePermissionChange = (key) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Appearance
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle dark theme
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email alerts
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Browser push notifications
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={notifications.push}
                onChange={() => handleNotificationChange('push')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">SMS Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive SMS alerts
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={notifications.sms}
                onChange={() => handleNotificationChange('sms')}
              />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Permissions
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">View Reports</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Access to view test reports
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={permissions.viewReports}
                onChange={() => handlePermissionChange('viewReports')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Edit Patients</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Modify patient records
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={permissions.editPatients}
                onChange={() => handlePermissionChange('editPatients')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Manage Users</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create and edit users
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={permissions.manageUsers}
                onChange={() => handlePermissionChange('manageUsers')}
              />
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              System Logs
            </h2>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockDataService.getAuditLogs().slice(-10).reverse().map((log) => (
              <div
                key={log.id}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {log.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

