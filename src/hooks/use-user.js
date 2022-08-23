//explain

import { useState, useEffect, useContext } from 'react';
import UserContext from '../context/user';
import { getUserByUserId } from '../services/firebase';

// 6. it makes an async call to firebase, gets some data, returns the user information from
// the users collections and we'll get the document for the user that's logged in
export default function useUser() {
    const [activeUser, setActiveUser] = useState({});
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function getUserObjByUserId() {
            // we need a function that we can call (firebase service) that gets the user data
            // based on the id
            const [response] = await getUserByUserId(user.uid);
            setActiveUser(response);
        }
        if (user?.uid) {
            getUserObjByUserId(user.uid);
        }
    }, [user]); //if this user (const { user } = useContext) changes, we want to change the user

    return { user: activeUser };
}
