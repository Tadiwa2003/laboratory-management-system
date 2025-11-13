import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Shield, Calendar, Activity } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import mockDataService from '../../services/mockData';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userLogs, setUserLogs] = useState([]);

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  const loadUserDetails = () => {
    const users = mockDataService.getUsers();
    const foundUser = users.find(u => u.id === id);
    
    if (foundUser) {
      setUser(foundUser);
      const logs = mockDataService.getAuditLogs();
      setUserLogs(logs.filter(log => log.userId === id));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">User not found</p>
          <Link to="/users" className="btn btn-primary mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-4">
        <Link to="/users">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            User Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user.name}
          </p>
        </div>
        <Link to={`/users/${id}/edit`}>
          <Button variant="primary">
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`badge ${user.active ? 'badge-success' : 'badge-error'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Activity Logs
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {userLogs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No activity logs found</p>
              ) : (
                userLogs.map((log) => (
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card text-center">
            <div className="avatar placeholder mb-4 mx-auto">
              <div className="bg-primary text-primary-content rounded-full w-24">
                <span className="text-3xl">{user.name.charAt(0)}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

