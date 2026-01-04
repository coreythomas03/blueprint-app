/**
 * Main Entry Point
 * 
 * This file is the entry point for the React application.
 * It renders the root App component and attaches it to the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
