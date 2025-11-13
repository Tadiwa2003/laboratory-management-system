import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoWarning, IoInformationCircle } from 'react-icons/io5';
import { useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <IoCheckmarkCircle className="w-6 h-6" />,
    error: <IoCloseCircle className="w-6 h-6" />,
    warning: <IoWarning className="w-6 h-6" />,
    info: <IoInformationCircle className="w-6 h-6" />,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md ${styles[type]}`}
      >
        {icons[type]}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <IoCloseCircle className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;

