import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
    getUserByUsername,
    getUserPhotosByUserId,
} from '../../services/firebase';
import Header from './header';
import Photos from './photos';

export default function Profile({ user }) {
    //explain a bit reducer, im not really familiar with it that much, i know its just for easier state handling
    const reducer = (state, newState) => ({ ...state, ...newState }); // so we can overwrite values such as username if it updates
    const initialState = {
        profile: {},
        photosCollection: [],
        followerCount: 0,
    };

    // we're gonna have an object that's gonna have a profile, a photosCollection, etc
    // dispatch allows you to set values. Which is what we're doing in the next useEffect
    const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
        reducer,
        initialState
    ); // i'm using the three values declared on initialState

    //explain this useEffect
    useEffect(() => {
        async function getProfileInfoAndPhotos() {
            const photos = await getUserPhotosByUserId(user.userId);
            // once we have this information we can dispatch and say 'look, we need to update the state
            // so i'm gonna say here is the profile (the user information is in there) etc
            dispatch({
                profile: user,
                photosCollection: photos,
                followerCount: user.followers.length,
            });
        }
        getProfileInfoAndPhotos();
    }, [user.username]);

    return (
        <>
            <Header
                photosCount={photosCollection ? photosCollection.length : 0}
                profile={profile}
                followerCount={followerCount}
                setFollowerCount={dispatch}
            />
            <Photos photos={photosCollection} />
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
