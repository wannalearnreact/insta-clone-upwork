//explain

import { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../context/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 4. The auth listener listens on authentication and installs some values on local storage (check it on console)
export default function useAuthListener() {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('authUser'))
    );
    const { firebase } = useContext(FirebaseContext);

    const auth = getAuth(firebase)

    useEffect(() => {
        const listener = onAuthStateChanged(auth, (authUser) => {
            // we have a user...therefore we can store the user in localstorage
            if (authUser) {
                localStorage.setItem('authUser', JSON.stringify(authUser));
                //once is storing in local storage, set user as authUser
                setUser(authUser);
            } else {
                // we don't have an authUser, therefore clear the localstorage
                localStorage.removeItem('authUser');
                setUser(null);
            }
        });

        return () => listener();
    }, [firebase]);

    return { user };
}
