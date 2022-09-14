import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/use-user';
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';
import Avatar from '../avatar';
import profilePlaceholder from '../../resources/profile-placeholder.svg';

import { changeProfilePicture } from '../../services/firebaseAuth';
import { fireAuth, fireStorage } from '../../firebase_settings/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { AiFillEdit } from 'react-icons/ai';

export default function Header({
    photosCount,
    followerCount,
    setFollowerCount,
    profile: {
        // docId is used in firebase queries
        docId: profileDocId,
        // userId in database
        userId: profileUserId,
        // userInfo
        imageSrc,
        fullName,
        followers = [],
        following = [],
        username: profileUsername,
        //docId is Raphael's docId, userId is Raphael's userId, etc
    },
}) {
    const { user } = useUser();
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const activeBtnFollow = user.username && user.username !== profileUsername; //explain

    const handleToggleFollow = async () => {
        // toggling react state by getting the previous version and flipping the bit
        // setState(  (previous) => !previous  )
        setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile); //true to false or false to true
        // increment the counter if the action is following, decrement otherwise
        setFollowerCount({
            followerCount: isFollowingProfile
                ? followerCount - 1
                : followerCount + 1,
        });
        // call the firebase toggle function
        await toggleFollow(
            isFollowingProfile,
            user.docId,
            profileDocId,
            profileUserId,
            user.userId
        );
    };

    // this useEffect relanches on every user change
    useEffect(() => {
        const isLoggedInUserFollowingProfile = async () => {
            const isFollowing = await isUserFollowingProfile(
                user.username,
                profileUserId
            ); // pass my username and the profile I'm in (ex. Raphael)
            // set the follwing action state according following state between the two users in the database.
            setIsFollowingProfile(!!isFollowing); // true or false according what firebase returns
        };

        // check if we have a user. If true, call that function
        if (user.username && profileUserId) {
            isLoggedInUserFollowingProfile();
        }
        setLoading(false);
    }, [user.username, profileUserId]); // and why these two paremeters

    async function onChangeProfilePicture(e) {
        setLoading(true);

        await changeProfilePicture(
            {
                image: e.target.files[0],
                userId: user.userId,
            },
            // onSuccess we reload the current component to match the new image
            (link) => window.location.reload(),
            () => {}
        );
        setLoading(false);
    }

    return (
        <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg '>
            <div className='container flex justify-center items-center	'>
                {user.username && (
                    <div className='relative '>
                        <img
                            src={imageSrc ? imageSrc : profilePlaceholder}
                            alt=''
                            className='rounded-full h-40 w-40 flex md:w-[100px] md:h-[100px]'
                        />
                        {!activeBtnFollow && (
                            <div>
                                <label
                                    htmlFor='profile'
                                    className='absolute bottom-2 right-9 bg-blue-medium rounded-full w-6 h-6 flex justify-center align-center cursor-pointer    md:bottom-1 md:right-6'
                                >
                                    <span>
                                        <AiFillEdit size={22} />
                                    </span>
                                </label>
                                <input
                                    className='hidden'
                                    type='file'
                                    id='profile'
                                    onChange={(e) => onChangeProfilePicture(e)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className='flex items-center justify-center flex-col col-span-2'>
                <div className='container flex-col items-center'>
                    <p className='text-2xl mr-4 capitalize'>
                        {profileUsername}
                    </p>
                    {/* check that we are not able to follow ourselves
                    'if it's a truty value and the user isn't on their own profile =>'*/}
                    {activeBtnFollow && (
                        <button
                            className='bg-gray-base font-bold text-sm rounded text-white
                            w-20 h-8'
                            type='button'
                            onClick={handleToggleFollow}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleToggleFollow();
                                }
                            }}
                        >
                            {isFollowingProfile ? 'Ditch' : 'Connect'}
                        </button>
                    )}
                </div>
                <div className='container flex mt-4'>
                    {followers === undefined || following === undefined ? (
                        <Skeleton count={1} width={677} height={24} />
                    ) : (
                        <div className='grid'>
                            <p className='mr-10'>
                                <span className='font-bold'>{photosCount}</span>{' '}
                                images
                            </p>
                            <p className='mr-10'>
                                <span className='font-bold'>
                                    {followerCount}
                                </span>
                                {` `}
                                {followerCount === 1 ? `follower` : `followers`}
                            </p>
                            <p className='mr-10'>
                                <span className='font-bold'>
                                    {following.length}
                                </span>
                                following
                            </p>
                        </div>
                    )}
                </div>
                <div className='container mt-4'>
                    <p className='font-bold capitalize'>
                        {!fullName ? (
                            <Skeleton count={1} height={24} />
                        ) : (
                            fullName
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

Header.propTypes = {
    photosCount: PropTypes.number.isRequired,
    followerCount: PropTypes.number.isRequired,
    setFollowerCount: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        docId: PropTypes.string,
        userId: PropTypes.string,
        fullName: PropTypes.string,
        username: PropTypes.string,
        following: PropTypes.array,
        followers: PropTypes.array,
    }).isRequired,
};
