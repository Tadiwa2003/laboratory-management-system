/**
 * Utility functions for 21st Extension Toolbar communication
 * Ensures prompts are sent to the current window
 */

/**
 * Send a prompt to the current window
 * This function can be called by the toolbar extension
 */
export const sendPromptToCurrentWindow = (prompt) => {
  if (typeof window === 'undefined') {
    console.error('❌ Window is not available');
    return;
  }

  console.log('📤 Sending prompt to current window:', prompt);
  console.log('📍 Target window:', window.location.href);

  // Method 1: Custom Event
  const customEvent = new CustomEvent('21st-toolbar-prompt', {
    detail: {
      type: 'toolbar-prompt',
      prompt: prompt,
      timestamp: new Date().toISOString(),
      source: 'toolbar-utils',
    },
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(customEvent);
  document.dispatchEvent(customEvent);

  // Method 2: postMessage to current window
  window.postMessage({
    type: '21st-toolbar-prompt',
    prompt: prompt,
    timestamp: new Date().toISOString(),
    source: 'toolbar-utils',
  }, window.location.origin);

  // Method 3: Store in window.toolbarPrompts
  if (!window.toolbarPrompts) {
    window.toolbarPrompts = [];
  }
  window.toolbarPrompts.push({
    prompt,
    timestamp: new Date().toISOString(),
    source: 'toolbar-utils',
  });

  // Method 4: Call global handler if available
  if (typeof window.receiveToolbarPrompt === 'function') {
    window.receiveToolbarPrompt(prompt);
  }

  if (typeof window.sendPromptToWindow === 'function') {
    window.sendPromptToWindow(prompt);
  }

  console.log('✅ Prompt sent via all available channels');
};

/**
 * Test function to verify prompt receiving is working
 */
export const testPromptReceiving = () => {
  console.log('🧪 Testing prompt receiving system...');
  sendPromptToCurrentWindow('Test prompt from toolbarUtils - ' + new Date().toLocaleTimeString());
};

/**
 * Get current window information for debugging
 */
export const getWindowInfo = () => {
  return {
    href: window.location.href,
    origin: window.location.origin,
    protocol: window.location.protocol,
    host: window.location.host,
    pathname: window.location.pathname,
    hasToolbarHandlers: {
      receiveToolbarPrompt: typeof window.receiveToolbarPrompt === 'function',
      sendPromptToWindow: typeof window.sendPromptToWindow === 'function',
      handleToolbarPrompt: typeof window.handleToolbarPrompt === 'function',
    },
    toolbarPromptsCount: window.toolbarPrompts ? window.toolbarPrompts.length : 0,
  };
};

// Expose to window for easy access
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.sendPromptToCurrentWindow = sendPromptToCurrentWindow;
  window.testPromptReceiving = testPromptReceiving;
  window.getToolbarWindowInfo = getWindowInfo;
  
  console.log('🔧 Toolbar utilities exposed to window:', {
    sendPromptToCurrentWindow: 'Available',
    testPromptReceiving: 'Available',
    getToolbarWindowInfo: 'Available',
  });
}

export default {
  sendPromptToCurrentWindow,
  testPromptReceiving,
  getWindowInfo,
};



