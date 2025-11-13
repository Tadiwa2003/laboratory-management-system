import { useEffect } from 'react';
import useNotificationStore from '../../store/notificationStore';
import Notification from '../common/Notification';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type || 'info'}
          onClose={() => removeNotification(notification.id)}
          duration={notification.duration || 5000}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;

