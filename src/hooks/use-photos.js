//explain

import { getDownloadURL, ref } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/user';
import { fireStorage } from '../firebase_settings/firebase';
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

            const formattedPhotos = await Promise.all(
                followedUserPhotos
                    // re-arrange array to be newest photos first by dateCreated
                    .sort((a, b) => b.dateCreated - a.dateCreated)
                    // get the download link of the image database reference
                    .map(async (it) => {
                        try {
                            const url = await getDownloadURL(
                                ref(fireStorage, it.imageSrc)
                            );
                            return { ...it, imageSrc: url };
                        } catch (error) {
                            return { ...it };
                        }
                    })
            );

            setPhotos(formattedPhotos);
        }

        getTimelinePhotos();
    }, [userId]);

    return { photos };
}
