//explain just FieldValue, never understood why we using it

import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

//here i want to import the seed file
//import {seedDatabase} from "../seed";

const config = {
    apiKey: 'AIzaSyDE4ad_XVdOU7y95QAGrhAkNoH6bUOzURk',
    authDomain: 'instagram-9a8c4.firebaseapp.com',
    projectId: 'instagram-9a8c4',
    storageBucket: 'instagram-9a8c4.appspot.com',
    messagingSenderId: '408793133640',
    appId: '1:408793133640:web:67821fab3ad03b9efd9e7d',
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

//here is where i want to call the seed file (only ONCE!)
//seedDatabase(firebase);

export { firebase, FieldValue };
