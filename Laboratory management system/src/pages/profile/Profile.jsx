import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import FormField from '../../components/forms/FormField';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: user || {},
  });

  const handleUpdateProfile = (data) => {
    updateUser(data);
    addNotification({ message: 'Profile updated successfully', type: 'success' });
    setIsEditing(false);
  };

  const handleChangePassword = (data) => {
    // Mock password change
    addNotification({ message: 'Password changed successfully', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-primary text-primary-content rounded-full w-24">
                <span className="text-3xl">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            </div>
            <button className="btn btn-sm btn-outline btn-primary mb-4">
              <Camera className="w-4 h-4 mr-2" />
              Upload Photo
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {user?.name || 'User'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.role || 'Role'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {user?.email || 'email@example.com'}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Personal Information
              </h2>
              {!isEditing && (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  <Save className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
              <FormField
                label="Full Name"
                name="name"
                register={register}
                error={errors.name}
                disabled={!isEditing}
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                disabled={!isEditing}
                required
              />
              <FormField
                label="Phone"
                name="phone"
                register={register}
                error={errors.phone}
                disabled={!isEditing}
              />
              <FormField
                label="Role"
                name="role"
                register={register}
                error={errors.role}
                disabled={true}
              />

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password */}
          <div className="card mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Change Password
            </h2>
            <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
              <FormField
                label="Current Password"
                name="currentPassword"
                type="password"
                register={register}
                error={errors.currentPassword}
                required
              />
              <FormField
                label="New Password"
                name="newPassword"
                type="password"
                register={register}
                error={errors.newPassword}
                required
              />
              <FormField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                register={register}
                error={errors.confirmPassword}
                required
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

