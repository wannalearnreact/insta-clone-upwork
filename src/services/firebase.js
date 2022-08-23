//refactor each function+explain better than it already has been explained

import { firebase, FieldValue } from '../lib/firebase';

export async function doesUsernameExist(username) {
    const result = await firebase //vamos a firebase que esta en la carpeta lib
        .firestore() //vamos a firestore
        .collection('users') //vamos a la coleccion de usuarios
        .where('username', '==', username.toLowerCase()) //donde username sea igual al username que el usuario pasa
        .get(); //traelo

    return result.docs.map((user) => user.data().length > 0);
}

export async function getUserByUsername(username) {
    // check if username exists
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username.toLowerCase())
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
    }));
}

// get user from the firestore where userId === userId (pasado del auth)
export async function getUserByUserId(userId) {
    const result = await firebase
        .firestore() //vamos a firestore
        .collection('users') //vamos a la coleccion de usuarios
        .where('userId', '==', userId) //donde userId sea igual al userId que el usuario pasa
        .get(); //traelo

    const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id, // we pass docId so we can use it for CRUD operations
    }));

    return user;
}

export async function getSuggestedProfiles(userId, following) {
    const result = await firebase
        .firestore()
        .collection('users')
        .limit(10)
        .get();

    return result.docs
        .map((user) => ({ ...user.data(), docId: user.id }))
        .filter(
            (profile) =>
                profile.userId !== userId && !following.includes(profile.userId)
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
    return firebase
        .firestore()
        .collection('users')
        .doc(loggedInUserDocId)
        .update({
            following: isFollowingProfile // is the user following the profile?
                ? FieldValue.arrayRemove(profileId) // <= if true
                : FieldValue.arrayUnion(profileId), // <= if false
        });
}

export async function updateFollowedUserFollowers( // update that user's profile to say 'hey, this are the people following this particular profile
    profileDocId,
    loggedInUserDocId, // currently logged in user document id (cindy's profile)
    isFollowingProfile //true/false (am i currently following this person?)
) {
    return firebase
        .firestore()
        .collection('users')
        .doc(profileDocId)
        .update({
            followers: isFollowingProfile // is the user following the profile?
                ? FieldValue.arrayRemove(loggedInUserDocId) // <= if true
                : FieldValue.arrayUnion(loggedInUserDocId), // <= if false
        });
}

export async function getPhotos(userId, following) {
    // [5, 4, 2] suppose we are following this users, we'll get the photos from all this particular users
    const result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', 'in', following)
        .get();

    const userFollowedPhotos = result.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id,
    }));

    console.log('userFollowedPhotos', userFollowedPhotos);

    const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async (photo) => {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }
            // photo.userId = 2 <- Raphael
            const user = await getUserByUserId(photo.userId);
            // Raphael
            const { username } = user[0];
            return { username, ...photo, userLikedPhoto };
        })
    );

    return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
    const result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', '==', userId)
        .get();

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
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', loggedInUserUsername) // cindy (active logged in user)
        .where('following', 'array-contains', profileUserId) // it's gonna check if Raphael exists in my 'following' array
        .get(); // get that data

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
