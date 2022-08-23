import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/use-user';
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';

export default function Header({
    photosCount,
    followerCount,
    setFollowerCount,
    profile: {
        //explain this object
        docId: profileDocId,
        userId: profileUserId,
        fullName,
        followers = [],
        following = [],
        username: profileUsername,
        //docId is Raphael's docId, userId is Raphael's userId, etc
    },
}) {
    const { user } = useUser();
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);
    const activeBtnFollow = user.username && user.username !== profileUsername; //explain

    //explain this whole function, i understand it but not 100%
    const handleToggleFollow = async () => {
        setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile); //true to false or false to true
        setFollowerCount({
            followerCount: isFollowingProfile
                ? followerCount - 1
                : followerCount + 1,
        });
        await toggleFollow(
            isFollowingProfile,
            user.docId,
            profileDocId,
            profileUserId,
            user.userId
        );
    };
    //explain this useEffect a bit more than i did
    useEffect(() => {
        const isLoggedInUserFollowingProfile = async () => {
            const isFollowing = await isUserFollowingProfile(
                user.username,
                profileUserId
            ); // pass my username and the profile I'm in (ex. Raphael)
            setIsFollowingProfile(!!isFollowing); // true or false according what firebase returns
        };

        // check if we have a user. If true, call that function
        if (user.username && profileUserId) {
            isLoggedInUserFollowingProfile();
        }
    }, [user.username, profileUserId]); // and why these two paremeters

    return (
        <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg'>
            <div className='container flex justify-center'>
                {user.username && (
                    <img
                        className='rounded-full h-40 w-40 flex'
                        alt={`${user.username} profile picture`}
                        src={`/images/avatars/${profileUsername}.jpg`}
                    />
                )}
            </div>
            <div className='flex items-center justify-center flex-col col-span-2'>
                <div className='container flex-col items-center'>
                    <p className='text-2xl mr-4'>{profileUsername}</p>
                    {/* check that we are not able to follow ourselves
                    'if it's a truty value and the user isn't on their own profile =>'*/}
                    {activeBtnFollow && (
                        <button
                            className='bg-blue-medium font-bold text-sm rounded text-white
                            w-20 h-8'
                            type='button'
                            onClick={handleToggleFollow}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleToggleFollow();
                                }
                            }}
                        >
                            {isFollowingProfile ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>
                <div className='container flex mt-4'>
                    {followers === undefined || following === undefined ? (
                        <Skeleton count={1} width={677} height={24} />
                    ) : (
                        <>
                            <p className='mr-10'>
                                <span className='font-bold'>{photosCount}</span>{' '}
                                photos
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
                        </>
                    )}
                </div>
                <div className='container mt-4'>
                    <p className='font-medium'>
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
