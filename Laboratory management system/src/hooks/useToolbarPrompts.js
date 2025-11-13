import { useEffect, useState } from 'react';

/**
 * Hook to receive and handle prompts from the 21st Extension Toolbar
 */
export const useToolbarPrompts = () => {
  const [prompt, setPrompt] = useState(null);
  const [promptHistory, setPromptHistory] = useState([]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // Listen for messages from the toolbar
    const handleMessage = (event) => {
      // Handle messages from the toolbar extension
      // Accept messages from same origin or from toolbar extension
      if (event.data && event.data.type === '21st-toolbar-prompt') {
        const receivedPrompt = event.data.prompt;
        console.log('📨 Received prompt via postMessage:', receivedPrompt);
        console.log('📍 From origin:', event.origin);
        console.log('📍 Current origin:', window.location.origin);
        
        setPrompt(receivedPrompt);
        
        // Add to history
        setPromptHistory(prev => [
          ...prev,
          {
            prompt: receivedPrompt,
            timestamp: event.data.timestamp || new Date().toISOString(),
            id: Date.now().toString(),
            source: event.data.source || 'postMessage',
          }
        ]);

        console.log('✅ Prompt processed and added to state');
      }
    };

    // Listen for custom events (alternative method)
    const handleCustomEvent = (event) => {
      if (event.detail && event.detail.type === 'toolbar-prompt') {
        const receivedPrompt = event.detail.prompt;
        setPrompt(receivedPrompt);
        
        setPromptHistory(prev => [
          ...prev,
          {
            prompt: receivedPrompt,
            timestamp: new Date().toISOString(),
            id: Date.now().toString(),
          }
        ]);

        console.log('📨 Received prompt from toolbar (custom event):', receivedPrompt);
      }
    };

    // Listen for window messages
    window.addEventListener('message', handleMessage);
    
    // Listen for custom events
    window.addEventListener('21st-toolbar-prompt', handleCustomEvent);
    
    // Listen for postMessage from same origin (current window)
    const handlePostMessage = (event) => {
      // Accept messages from same origin or allow cross-origin for toolbar
      if (event.data && event.data.type === '21st-toolbar-prompt') {
        console.log('📬 postMessage received in current window:', event.data);
        handleMessage(event);
      }
    };
    window.addEventListener('message', handlePostMessage);
    
    // Also listen on document for broader capture
    document.addEventListener('message', handlePostMessage);

    // Listen for direct function calls from toolbar
    const checkForPrompts = () => {
      if (window.toolbarPrompts && window.toolbarPrompts.length > 0) {
        const latestPrompt = window.toolbarPrompts[window.toolbarPrompts.length - 1];
        // Check if we've already processed this prompt
        setPromptHistory(prev => {
          const alreadyProcessed = prev.find(
            p => p.prompt === latestPrompt.prompt && p.timestamp === latestPrompt.timestamp
          );
          if (!alreadyProcessed) {
            setPrompt(latestPrompt.prompt);
            return [
              ...prev,
              {
                prompt: latestPrompt.prompt,
                timestamp: latestPrompt.timestamp,
                id: Date.now().toString(),
              }
            ];
          }
          return prev;
        });
      }
    };

    // Check periodically for prompts stored in window
    const intervalId = setInterval(checkForPrompts, 500);

    // Log that listeners are set up
    console.log('👂 Prompt listeners active on current window:', window.location.href);
    console.log('📡 Listening for:', [
      'window.message events',
      '21st-toolbar-prompt custom events',
      'window.toolbarPrompts array',
    ]);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('message', handlePostMessage);
      document.removeEventListener('message', handlePostMessage);
      window.removeEventListener('21st-toolbar-prompt', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, []);

  const clearPrompt = () => {
    setPrompt(null);
  };

  return {
    prompt,
    promptHistory,
    clearPrompt,
    hasPrompt: prompt !== null,
  };
};

export default useToolbarPrompts;

