// Use the working createElement approach to bypass bootstrap issues
console.log('🚀 Main.ts starting...');
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔄 Initializing React directly...');

// Import React directly at the top level
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';

// Initialize React directly without dynamic imports
try {
  console.log('📝 Looking for root element...');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('⚛️ Creating React root...');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  console.log('🎨 Rendering React app...');
  const React = require('react');
  root.render(
    React.createElement(
      StrictMode,
      {},
      React.createElement(BrowserRouter, {}, React.createElement(App, {}))
    )
  );

  console.log('✅ React app rendered successfully!');
} catch (error) {
  console.error('💥 React initialization failed:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>🚨 React Error</h1>
    <p><strong>Error:</strong> ${(error as Error).message}</p>
    <pre>${(error as Error).stack}</pre>
  </div>`;
}
