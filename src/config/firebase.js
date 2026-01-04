/**
 * Firebase Configuration
 * 
 * This file initializes the Firebase app with configuration from environment variables.
 * The configuration values are stored in .env file and accessed via import.meta.env.
 * 
 * Security Implementation:
 * - API keys are stored in environment variables, not hardcoded
 * - .env file is excluded from version control via .gitignore
 * - Configuration validation ensures all required variables are present
 * 
 * Environment Variables Required (defined in .env):
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please create a .env file based on .env.example');
}

// Firebase configuration object constructed from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export for use throughout the app
export const auth = getAuth(app);

// Initialize Firestore and export for database operations
export const db = getFirestore(app);

export default app;
