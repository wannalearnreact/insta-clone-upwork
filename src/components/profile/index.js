import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getUserPhotosByUserId } from '../../services/firebase';
import Header from './Header';
import Photos from './Photos';
import { getDownloadURL, ref } from 'firebase/storage';
import { fireStorage } from '../../firebase_settings/firebase';
import { deletePost } from '../../services/firebasePosts';
import { useState } from 'react';
import useUser from '../../hooks/use-user';

export default function Profile({ user }) {
    //explain a bit reducer, im not really familiar with it that much, i know its just for easier state handling
    const reducer = (state, newState) => ({ ...state, ...newState }); // so we can overwrite values such as username if it updates
    const initialState = {
        profile: {},
        photosCollection: [],
        followerCount: 0,
    };
    const [loadingIndex, setLoadingIndex] = useState(-1);
    // we're gonna have an object that's gonna have a profile, a photosCollection, etc
    // dispatch allows you to set values. Which is what we're doing in the next useEffect
    const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
        reducer,
        initialState
    ); // i'm using the three values declared on initialState

    const { user: current } = useUser();
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    //  fetch the posts when the component first mount and the user is fetched
    useEffect(() => {
        fetch();
    }, [user.username]);

    useEffect(() => {
        setIsCurrentUser(user?.userId == current?.userId);
    }, [user, current]);

    async function getProfileInfoAndPhotos() {
        const photos = await getUserPhotosByUserId(user.userId);
        // once we have this information we can dispatch and say 'look, we need to update the state
        // so i'm gonna say here is the profile (the user information is in there) etc

        const formatted = await Promise.all(
            photos.map(async (it) => {
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

        dispatch({
            profile: user,
            photosCollection: formatted,
            followerCount: user.followers?.length ?? 0,
        });
    }
    async function fetch() {
        await getProfileInfoAndPhotos();
    }

    async function onDeletePost(postId, postIndex) {
        setLoadingIndex(postIndex);
        await deletePost({ postId });
        // refetch the data so that the posts be up-to-date
        await fetch();
        setLoadingIndex(-1);
    }

    return (
        <>
            <Header
                photosCount={photosCollection ? photosCollection.length : 0}
                profile={profile}
                followerCount={followerCount}
                setFollowerCount={dispatch}
            />
            <Photos
                photos={photosCollection}
                onDeletePost={onDeletePost}
                loadingIndex={loadingIndex}
                isCurrentUser={isCurrentUser}
            />
        </>
    );
}

Profile.propTypes = {
    user: PropTypes.shape({
        dateCreated: PropTypes.number,
        emailAddress: PropTypes.string,
        followers: PropTypes.array,
        following: PropTypes.array,
        fullName: PropTypes.string,
        userId: PropTypes.string,
        username: PropTypes.string,
    }),
};
