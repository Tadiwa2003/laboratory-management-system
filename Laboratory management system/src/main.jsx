import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Import the toolbar
import { initToolbar } from '@21st-extension/toolbar';

// Import toolbar utilities
import './utils/toolbarUtils';

// 2. Define your toolbar configuration
const stagewiseConfig = {
  plugins: [],
  // App metadata for toolbar IDE window
  app: {
    name: 'Laboratory Management System',
    shortName: 'Linos LMS',
    displayName: 'Laboratory Management System',
    workspaceName: 'Laboratory Management System',
    description: 'Laboratory Management System for managing patients, specimens, tests, and results',
    version: '1.0.0',
    url: typeof window !== 'undefined' ? window.location.href : '',
    id: 'linos-lms',
  },
  // Workspace configuration for IDE window
  workspace: {
    name: 'Laboratory Management System',
    displayName: 'Laboratory Management System',
    path: typeof window !== 'undefined' ? window.location.pathname : '',
  },
  // Add prompt handler callback
  onPrompt: (prompt) => {
    console.log('📨 Toolbar prompt received in main.jsx:', prompt);
    console.log('📍 Current window:', window.location.href);
    
    // Dispatch custom event for React components to listen
    const event = new CustomEvent('21st-toolbar-prompt', {
      detail: {
        type: 'toolbar-prompt',
        prompt: prompt,
        timestamp: new Date().toISOString(),
        source: 'toolbar',
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    
    // Also send via postMessage to current window
    window.postMessage({
      type: '21st-toolbar-prompt',
      prompt: prompt,
      timestamp: new Date().toISOString(),
      source: 'toolbar',
    }, window.location.origin);
    
    // Also store in window for direct access
    if (!window.toolbarPrompts) {
      window.toolbarPrompts = [];
    }
    window.toolbarPrompts.push({
      prompt,
      timestamp: new Date().toISOString(),
      source: 'toolbar',
    });
    
    console.log('✅ Prompt dispatched to current window via multiple channels');
  },
};

// 3. Initialize the toolbar when your app starts
// Framework-agnostic approach - call this when your app initializes
function setupStagewise() {
  // Only initialize once and only in development mode
  if (import.meta.env.DEV) {
    try {
      initToolbar(stagewiseConfig);
      console.log('✅ 21st Extension Toolbar initialized');
      
      // Expose global function for toolbar to send prompts to this window
      window.receiveToolbarPrompt = (prompt) => {
        console.log('📥 receiveToolbarPrompt called with:', prompt);
        console.log('📍 Target window:', window.location.href);
        if (stagewiseConfig.onPrompt) {
          stagewiseConfig.onPrompt(prompt);
        }
      };
      
      // Also expose a direct send function
      window.sendPromptToWindow = (prompt) => {
        console.log('📤 sendPromptToWindow called with:', prompt);
        if (stagewiseConfig.onPrompt) {
          stagewiseConfig.onPrompt(prompt);
        }
      };
      
      // Expose app information to window for toolbar access
      window.linosLMS = {
        name: 'Laboratory Management System',
        shortName: 'Linos LMS',
        displayName: 'Laboratory Management System',
        workspaceName: 'Laboratory Management System',
        description: 'Laboratory Management System for managing patients, specimens, tests, and results',
        version: '1.0.0',
        url: window.location.href,
        initialized: true,
      };
      
      // Expose workspace name for toolbar IDE window
      if (typeof window !== 'undefined') {
        window.__21ST_WORKSPACE_NAME__ = 'Laboratory Management System';
        window.__21ST_APP_NAME__ = 'Laboratory Management System';
      }
      
      // Set app identifier for toolbar IDE window
      if (document.documentElement) {
        document.documentElement.setAttribute('data-app-name', 'Laboratory Management System');
        document.documentElement.setAttribute('data-app-short-name', 'Linos LMS');
      }
      
      // Update document title and meta tags
      document.title = 'Laboratory Management System - Linos LMS';
      
      // Update or create meta tags for app identification
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Laboratory Management System for managing patients, specimens, tests, and results');
      
      // Add app name meta tag
      let metaAppName = document.querySelector('meta[name="application-name"]');
      if (!metaAppName) {
        metaAppName = document.createElement('meta');
        metaAppName.setAttribute('name', 'application-name');
        document.head.appendChild(metaAppName);
      }
      metaAppName.setAttribute('content', 'Laboratory Management System');
      
      // Log window information for debugging
      console.log('🌐 Window ready to receive prompts:', {
        href: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol,
        host: window.location.host,
      });
      console.log('📱 App exposed to toolbar:', window.linosLMS);
    } catch (error) {
      console.error('❌ Error initializing toolbar:', error);
    }
  }
}

// Initialize theme on app load
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme-storage');
  if (savedTheme) {
    try {
      const theme = JSON.parse(savedTheme);
      if (theme.state?.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error loading theme:', e);
    }
  }
};

// Initialize theme before rendering
initializeTheme();

// Call the setup function when appropriate for your framework
setupStagewise();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
