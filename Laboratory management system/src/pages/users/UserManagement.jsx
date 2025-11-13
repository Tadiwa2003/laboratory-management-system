import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import FormField from '../../components/forms/FormField';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';
import mockDataService from '../../services/mockData';

const ROLES = [
  'Lab Administrator',
  'Lab Technician',
  'Lab Supervisor',
  'Reception Staff',
  'Healthcare Provider',
  'Specimen Collector',
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadUsers();
    loadAuditLogs();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const loadUsers = () => {
    const allUsers = mockDataService.getUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  const loadAuditLogs = () => {
    const logs = mockDataService.getAuditLogs();
    setAuditLogs(logs);
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = (data) => {
    const newUser = mockDataService.createUser({
      ...data,
      active: true,
    });
    mockDataService.addAuditLog('CREATE_USER', currentUser?.id, { userId: newUser.id });
    addNotification({ message: 'User created successfully', type: 'success' });
    loadUsers();
    loadAuditLogs();
    setIsModalOpen(false);
    reset();
  };

  const handleUpdateUser = (data) => {
    mockDataService.updateUser(editingUser.id, data);
    mockDataService.addAuditLog('UPDATE_USER', currentUser?.id, { userId: editingUser.id });
    addNotification({ message: 'User updated successfully', type: 'success' });
    loadUsers();
    loadAuditLogs();
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      mockDataService.deleteUser(userId);
      mockDataService.addAuditLog('DELETE_USER', currentUser?.id, { userId });
      addNotification({ message: 'User deleted successfully', type: 'success' });
      loadUsers();
      loadAuditLogs();
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    reset(user);
    setIsModalOpen(true);
  };

  const handleResetPassword = (userId) => {
    mockDataService.updateUser(userId, { password: 'password123' });
    mockDataService.addAuditLog('RESET_PASSWORD', currentUser?.id, { userId });
    addNotification({ message: 'Password reset successfully', type: 'success' });
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Role',
      accessor: 'role',
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleResetPassword(value)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(value)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            reset();
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredUsers}
          emptyMessage="No users found"
        />
      </div>

      {/* Audit Logs */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Audit Logs
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {auditLogs.slice(-20).reverse().map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {log.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          reset();
        }}
        title={editingUser ? 'Edit User' : 'Create New User'}
        size="md"
      >
        <form
          onSubmit={handleSubmit(editingUser ? handleUpdateUser : handleCreateUser)}
          className="space-y-4"
        >
          <FormField
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            required
          />
          {!editingUser && (
            <FormField
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              required
            />
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a role</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.role.message}
              </p>
            )}
          </div>
          {editingUser && (
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('active')}
                  defaultChecked={editingUser.active}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;

