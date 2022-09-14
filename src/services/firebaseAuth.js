import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { doesUsernameExist, getUserByUserId } from './firebase';
import {
    fireStore as db,
    fireAuth,
    fireStorage,
} from '../firebase_settings/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { generateRandomImageName } from '../helpers/image-name-generator';

// possible auth errors
export const AuthErrors = {
    USERNAME_EXISTS: 0,
    DATABASE_ERROR: 1,
};

export async function signIn({ emailAddress, password }, onSuccess, onError) {
    try {
        await signInWithEmailAndPassword(fireAuth, emailAddress, password);
        onSuccess();
    } catch (error) {
        onError('Wrong Email or Passowrd!');
    }
}

export async function signUp(credentials, onSuccess, onError) {
    const { emailAddress, password, username, fullName } = credentials;

    // checks if user exists
    const usernameExists = await doesUsernameExist(username);

    if (usernameExists.length) {
        // launch the error callback if exists with this error type
        onError({
            type: AuthErrors.USERNAME_EXISTS,
            message: 'That username is already taken, please try another',
        });
        return;
    }

    try {
        const createdUserResult = await createUserWithEmailAndPassword(
            fireAuth,
            emailAddress,
            password
        );

        // update the user's firebase auth profile to the username
        await updateProfile(createdUserResult.user, {
            displayName: username,
        });

        // create user's entry in firestore to store extra and perform actions
        const usersRef = collection(db, 'users');
        await addDoc(usersRef, {
            userId: createdUserResult.user.uid,
            username: username.toLowerCase(),
            fullName,
            emailAddress: emailAddress.toLowerCase(),
            following: [],
            dateCreated: Date.now(),
        });

        onSuccess();
    } catch (error) {
        onError({
            type: AuthErrors.DATABASE_ERROR,
            message: error.message,
        });
    }
}

export async function changeProfilePicture(userData, onSuccess, onError) {
    try {
        const { image, userId } = userData;
        const renamedImage = new File([image], generateRandomImageName());
        // saves the photo to firebase storage
        const path = `image/profile/${userId}/${renamedImage.name}`;
        const imagesRef = ref(fireStorage, path);
        const storageSnapShot = await uploadBytes(imagesRef, renamedImage);
        const imageSrc = storageSnapShot.metadata.fullPath;

        const user = fireAuth.currentUser;
        if (user !== null) {
            // updating the profile to use this photo
            const result = await updateProfile(user, {
                photoURL: imageSrc,
            });

            // return the download link to the callback to update the existing photo
            const downloadLink = await getDownloadURL(
                ref(fireStorage, fireAuth.currentUser.photoURL)
            );

            // save it to the database in the background. so other users to be able to see it.
            const [{ docId }] = await getUserByUserId(user.uid);
            /*  console.log(docId) */
            const userDoc = doc(db, 'users', docId);
            await updateDoc(userDoc, {
                imageSrc: path,
            });

            onSuccess(downloadLink);
        } else console.log('error');
    } catch (error) {
        onError();
        console.log(error);
    }
}
