//explain

import { getDownloadURL, ref } from 'firebase/storage';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../context/user';
import { fireAuth, fireStorage } from '../firebase_settings/firebase';
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

            let image;

            if (fireAuth.currentUser?.photoURL) {
                image = await getDownloadURL(
                    ref(fireStorage, fireAuth.currentUser?.photoURL)
                ).catch((error) => console.log({ error }));
            }

            setActiveUser({ ...response, imageSrc: image });
        }
        if (user?.uid) {
            getUserObjByUserId(user.uid);
        }
    }, [user]); //if this user (const { user } = useContext) changes, we want to change the user

    // get the new profile picture link to refresh it
    function onRefreshProfilePicture(link) {
        setActiveUser({ ...activeUser, imageSrc: link });
    }

    return { user: activeUser, onRefreshProfilePicture };
}
