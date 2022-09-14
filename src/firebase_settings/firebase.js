//explain just FieldValue, never understood why we using it
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    /* 
    apiKey: 'AIzaSyAo2OVPs7zpJVQwCFDXFOYXUAFYtLy4MN8',
    authDomain: 'social-media-1da99.firebaseapp.com',
    projectId: 'social-media-1da99',
    storageBucket: 'social-media-1da99.appspot.com',
    messagingSenderId: '996198504608',
    appId: '1:996198504608:web:2dad1ea9960c55f30491c5', */
};

const firebase = initializeApp(config);

// initialize and export the needed services only
const fireStore = getFirestore(firebase);
const fireAuth = getAuth(firebase);
const fireStorage = getStorage(firebase);
export { firebase, fireStore, fireAuth, fireStorage };
