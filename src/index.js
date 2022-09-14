import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FirebaseContext from './context/firebase';
import { firebase } from './firebase_settings/firebase';
import './styles/app.css';
import './styles/tailwind.css';
import 'react-loading-skeleton/dist/skeleton.css';

//how does the app work?
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //1. we wrap the application in a firebaseContext so the entire app has access to firebase
    <FirebaseContext.Provider value={{ firebase }}>
        <App />
    </FirebaseContext.Provider>
);

//client side rendered app: react (cra)
// -> connect to our database which us firebase
// -> external dependecies, react-loading-skeleton
// for styling tailwind

// folder structure
//src
//-> components,
//-> constants,
//-> context,
//-> helpers,
//-> hooks,
//-> pages,
//-> lib (firebase is going to live in here) [you need to replace to config file here],
//-> services (firebase functions is here)
//-> styles (tailwind's folder (app/tailwind))
