//explain just FieldValue, never understood why we using it

import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

//here i want to import the seed file
//import {seedDatabase} from "../seed";

const config = {};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

//here is where i want to call the seed file (only ONCE!)
//seedDatabase(firebase);

export { firebase, FieldValue };
