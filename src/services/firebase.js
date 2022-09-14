//refactor each function+explain better than it already has been explained

import { fireStorage, fireStore as db } from '../firebase_settings/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    limit,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

// check if username exists
export async function doesUsernameExist(username) {
    // quering users with the same username
    const q = query(
        collection(db, 'users'),
        where('username', '==', username.toLowerCase())
    );
    const result = await getDocs(q);
    // checks if the result array contains any entries.
    return result.docs.map((user) => user.data().length > 0);
}

export async function getUserByUsername(username) {
    // check if username exists
    const q = query(
        collection(db, 'users'),
        where('username', '==', username.toLowerCase())
    );
    const result = await getDocs(q);
    return Promise.all(
        result.docs.map(async (item) => ({
            ...item.data(),
            docId: item.id, // we pass docId so we can use it for CRUD operations
            imageSrc:
                item.data().imageSrc &&
                // convert the image reference to downloadable link
                (await getDownloadURL(
                    ref(fireStorage, item.data().imageSrc)
                ).catch((error) => {})),
        }))
    );
}

// get user from the firestore where userId === userId (pasado del auth)
export async function getUserByUserId(userId) {
    const q = query(collection(db, 'users'), where('userId', '==', userId));
    const result = await getDocs(q);

    const user = Promise.all(
        result.docs.map(async (item) => ({
            ...item.data(),
            docId: item.id, // we pass docId so we can use it for CRUD operations
            imageSrc:
                item.data().imageSrc &&
                // convert the image reference to downloadable link
                (await getDownloadURL(
                    ref(fireStorage, item.data().imageSrc)
                ).catch((error) => {})),
        }))
    );

    return user;
}

export async function getSuggestedProfiles(userId, following) {
    const q = query(collection(db, 'users'), limit(10));
    const result = await getDocs(q);

    /* console.log({ result: result.docs[0].data(), userId }) */
    return await Promise.all(
        result.docs
            .filter(
                (profile) =>
                    profile.data().userId !== userId &&
                    !following.includes(profile.data().userId)
            )
            .map(async (user) => {
                try {
                    const url = await getDownloadURL(
                        ref(fireStorage, user.data().imageSrc)
                    );
                    return { ...user.data(), docId: user.id, imageSrc: url };
                } catch (error) {
                    return { ...user.data(), docId: user.id };
                }
            })
    ); // let's say I have Rafael's userId which is '2', I wanna make
    // make sure is not equal to my userId and that
    // they are not showing profiles that I'm already following
}

// updateLoggedInUserFollowing, updateFollowedUserFollowers
export async function updateLoggedInUserFollowing( // update my own profile to say i'm following a particular user
    loggedInUserDocId, // currently logged in user document id (cindy's profile)
    profileId, // the user that Cindy requests to follow
    isFollowingProfile //true/false (am i currently following this person?)
) {
    const ref = doc(db, 'users', loggedInUserDocId);
    await updateDoc(ref, {
        following: isFollowingProfile // is the user following the profile?
            ? arrayRemove(profileId) // <= if true
            : arrayUnion(profileId), // <= if false
    });
}

export async function updateFollowedUserFollowers( // update that user's profile to say 'hey, this are the people following this particular profile
    profileDocId,
    loggedInUserDocId, // currently logged in user document id (cindy's profile)
    isFollowingProfile //true/false (am i currently following this person?)
) {
    const ref = doc(db, 'users', profileDocId);
    await updateDoc(ref, {
        followers: isFollowingProfile // is the user following the profile?
            ? arrayRemove(loggedInUserDocId) // <= if true
            : arrayUnion(loggedInUserDocId), // <= if false
    });
}

export async function getPhotos(userId, following) {
    // [5, 4, 2] suppose we are following this users, we'll get the photos from all this particular users
    const q = query(collection(db, 'photos'), where('userId', 'in', following));

    const result = await getDocs(q);

    const userFollowedPhotos = result.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id,
    }));

    /* console.log('userFollowedPhotos', userFollowedPhotos); */

    const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async (photo) => {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }
            // photo.userId = 2 <- Raphael
            const user = await getUserByUserId(photo.userId);
            // Raphael
            const { username, imageSrc } = user[0];
            let url;
            try {
                if (imageSrc)
                    url = await getDownloadURL(ref(fireStorage, imageSrc));
            } catch (error) {
                console.log({ error });
            }
            return { username, ...photo, userLikedPhoto, userImageSrc: url };
        })
    );

    return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
    const q = query(collection(db, 'photos'), where('userId', '==', userId));
    const result = await getDocs(q);

    const photos = result.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id,
    }));
    return photos;
}

export async function isUserFollowingProfile(
    loggedInUserUsername,
    profileUserId
) {
    const q = query(
        collection(db, 'users'),
        where('username', '==', loggedInUserUsername), // cindy (active logged in user)
        where('following', 'array-contains', profileUserId) // it's gonna check if Raphael exists in my 'following' array
    );

    const result = await getDocs(q);

    const [response = {}] = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
    }));

    return response.userId;
}

// activeUserDocId => my Id (the logged in user)
// profileDocId => Raphael's DocId (the profile I'm currently visiting)
export async function toggleFollow(
    isFollowingProfile,
    activeUserDocId,
    profileDocId,
    profileUserId,
    followingUserId
) {
    // activeUserDocId (1st param): cindy's doc Id
    // profileUserId (2nd param): raphael's user id
    // isFollowingProfile (3rd param): is the user following this profile? e.g does cindy follow raphael? (true/false)
    await updateLoggedInUserFollowing(
        activeUserDocId,
        profileUserId,
        isFollowingProfile
    );

    // activeUserDocId (1st param): cindy's user Id
    // followingUserId (2nd param): the user that cindy request to follow (Raphael doc id)
    // isFollowingProfile (3rd param): is the user following this profile? e.g does cindy follow raphael? (true/false)
    await updateFollowedUserFollowers(
        profileDocId,
        followingUserId,
        isFollowingProfile
    );
}
