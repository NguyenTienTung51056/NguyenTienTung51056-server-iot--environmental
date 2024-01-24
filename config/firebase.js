import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import env from 'dotenv';

env.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

let app;
let storage;

const initializeFirebaseApp = async () => {
    try {
        if (!app) {
            app = initializeApp(firebaseConfig);
            storage = getStorage(app);
        }
        return app;
    } catch (error) {
        console.error('Error initializing Firebase app:', error);
        throw error;
    }
};

const getFirebaseApp = () => {
    if (!app) {
        console.error('Firebase app not initialized. Call initializeFirebaseApp() first.');
    }
    return app;
};

const getFirebaseStorage = () => {
    if (!storage) {
        console.error('Firebase storage not initialized. Call initializeFirebaseApp() first.');
    }
    return storage;
};

export { initializeFirebaseApp, getFirebaseApp, getFirebaseStorage };
