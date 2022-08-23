//explain

import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/user';
import { getPhotos, getUserByUserId } from '../services/firebase';

// 5. it allows us to get photos from the collection of photos for a particular user
export default function usePhotos() {
    const [photos, setPhotos] = useState(null);
    const {
        user: { uid: userId = '' }, //it's called uid but I refer to it as userId
    } = useContext(UserContext);

    useEffect(() => {
        async function getTimelinePhotos() {
            // example: [2, 1, 5] <- 2 being raphel
            const [{ following }] = await getUserByUserId(userId);
            let followedUserPhotos = [];

            // does the user actually follow people?
            if (following.length > 0) {
                followedUserPhotos = await getPhotos(userId, following);
            }

            // re-arrange array to be newest photos first by dateCreated
            followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
            setPhotos(followedUserPhotos);
        }

        getTimelinePhotos();
    }, [userId]);

    return { photos };
}
