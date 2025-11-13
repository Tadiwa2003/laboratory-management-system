import { useEffect } from 'react';
import useToolbarPrompts from '../../hooks/useToolbarPrompts';
import useNotificationStore from '../../store/notificationStore';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Component to display and handle prompts from the 21st Extension Toolbar
 */
const ToolbarPromptHandler = () => {
  const { prompt, promptHistory, clearPrompt, hasPrompt } = useToolbarPrompts();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (prompt) {
      // Show notification when prompt is received
      addNotification({
        message: `New prompt received: ${prompt.substring(0, 50)}...`,
        type: 'info',
        duration: 5000,
      });
    }
  }, [prompt, addNotification]);

  // Expose a global function for the toolbar to send prompts
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      // Create a global handler that the toolbar can call
      window.handleToolbarPrompt = (promptText) => {
        const event = new CustomEvent('21st-toolbar-prompt', {
          detail: {
            type: 'toolbar-prompt',
            prompt: promptText,
          },
        });
        window.dispatchEvent(event);
      };

      // Log that handlers are ready
      console.log('✅ Toolbar prompt handlers ready on current window');
      console.log('📍 Window URL:', window.location.href);
      console.log('🧪 Test functions available:');
      console.log('   - window.handleToolbarPrompt("your prompt")');
      console.log('   - window.receiveToolbarPrompt("your prompt")');
      console.log('   - window.sendPromptToCurrentWindow("your prompt")');
      console.log('   - window.testPromptReceiving()');
      console.log('   - window.getToolbarWindowInfo()');

      return () => {
        // Don't delete receiveToolbarPrompt as it's set in main.jsx
        if (window.handleToolbarPrompt) {
          delete window.handleToolbarPrompt;
        }
      };
    }
  }, []);

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <AnimatePresence>
      {hasPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 w-96 max-w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Toolbar Prompt
                </h3>
              </div>
              <button
                onClick={clearPrompt}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {prompt}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Prompt received from 21st Extension Toolbar</span>
              <span>{promptHistory.length} total</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolbarPromptHandler;

