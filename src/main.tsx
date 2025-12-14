import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.log('🔧 Main.tsx is loading...');

const rootElement = document.getElementById('root');
console.log('🔧 Root element found:', !!rootElement);

if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="color: red; padding: 20px;">ERROR: Root element not found!</div>';
} else {
  console.log('✅ Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('✅ Rendering App...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully!');
}