import { fireStorage, fireStore as db } from '../firebase_settings/firebase';
import {
    addDoc,
    collection,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
    deleteDoc,
} from 'firebase/firestore';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { generateRandomImageName } from '../helpers/image-name-generator';

export async function likePost({ docId, userId, liked }, onSuccess, onError) {
    try {
        const ref = doc(db, 'photos', docId);

        await updateDoc(ref, {
            likes: liked ? arrayRemove(userId) : arrayUnion(userId), // if they liked it (toggleLiked = true), remove name from array // P.S. leave my comments or
            //add another if my are not good enough
        });

        onSuccess();
    } catch (error) {
        onError();
    }
}

export async function commentOnPost({ docId, displayName, comment }) {
    try {
        const ref = doc(db, 'photos', docId);
        return await updateDoc(ref, {
            comments: arrayUnion({ displayName, comment }),
        });
    } catch (error) {}
}

export async function createPost(postInfo, onSuccess, onError) {
    try {
        const { image, userId, caption } = postInfo;
        const renamedImage = new File([image], generateRandomImageName());

        // add the image to the storage
        const path = `images/${userId}/${renamedImage.name}`;
        const imagesRef = ref(fireStorage, path);

        // uploading
        const storageSnapShot = await uploadBytes(imagesRef, renamedImage);
        const imageSrc = storageSnapShot.metadata.fullPath;

        // save the post to firestore with the imageSrc returned from the fire storage
        const post = {
            userId,
            imageSrc,
            caption: caption ?? '',
            photoId: renamedImage.name,
            likes: [],
            comments: [],
            dateCreated: Date.now(),
        };

        const postRef = collection(db, 'photos');
        await addDoc(postRef, post);

        onSuccess();
    } catch (error) {
        onError(error.message);
    }
}

export async function deletePost(postInfo) {
    const { postId } = postInfo;
    try {
        // get the image from the storage first
        const postRef = doc(db, 'photos', postId);
        const result = (await getDoc(postRef)).data();
        if (!result) return;

        // delete the image from the storage
        const imageRef = ref(fireStorage, result.imageSrc);
        await deleteObject(imageRef).catch(() => {});
        // delete the post entry in firestore
        await deleteDoc(postRef);
    } catch (error) {
        console.log({ error });
    }
}
