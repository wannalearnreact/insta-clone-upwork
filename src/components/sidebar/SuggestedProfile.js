//no need to explain anything

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    updateLoggedInUserFollowing,
    updateFollowedUserFollowers,
} from '../../services/firebase';
import Avatar, { AvatarVariants } from '../avatar';
import useUser from '../../hooks/use-user';
import profilePlaceholder from '../../resources/profile-placeholder.svg';
export default function SuggestedProfile({
    profileDocId,
    username,
    profileId,
    userId,
    imageSrc,
    loggedInUserDocId,
}) {
    const [followed, setFollowed] = useState(false);
    const { user } = useUser();
    async function handleFollowUser() {
        setFollowed(true);

        // firebase: create 2 services (functions)
        // update the following array of the logged in user (in this case, my profile)
        await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
        // update the followers array of the user who has been followed
        await updateFollowedUserFollowers(profileDocId, userId, false); // userId because I wanna put my userId in his followers
    }

    return !followed ? (
        <div className='flex flex-row items-center align-items justify-between border-4 border-solid rounded-xl mt-2 p-2 border-gray-border'>
            <div className='flex items-center justify-between '>
                <div className='rounded-full w-8 flex mr-2'>
                    {/*  <Avatar variant={AvatarVariants.extraSmall} src={imageSrc} /> */}
                    <img
                        src={imageSrc ? imageSrc : profilePlaceholder}
                        alt=''
                        className='rounded-full w-8 h-8 flex mr-3'
                    />
                </div>

                <Link to={`/p/${username}`}>
                    <p className='font-bold text-sm capitalize'>{username}</p>
                </Link>
            </div>
            <div>
                <button
                    className='text-sm font-bold text-[black] '
                    type='button'
                    onClick={handleFollowUser}
                >
                    Connect
                </button>
            </div>
        </div>
    ) : null;
}

SuggestedProfile.propTypes = {
    profileDocId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    loggedInUserDocId: PropTypes.string.isRequired,
};
