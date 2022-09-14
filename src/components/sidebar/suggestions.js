import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { getSuggestedProfiles } from '../../services/firebase';
import SuggestedProfile from './SuggestedProfile';
import useUser from '../../hooks/use-user';

export default function Suggestions({ userId, following, loggedInUserDocId }) {
    const [profiles, setProfiles] = useState(null);
    const { user } = useUser();
    //explain a bit more
    // go ahead and get the suggested profiles
    useEffect(() => {
        async function suggestedProfiles() {
            const response = await getSuggestedProfiles(userId, following);
            setProfiles(response);
            /*  console.log(response); */
        }

        /*  console.log('userId', userId); */

        if (userId) {
            suggestedProfiles();
        }
    }, [userId]);
    // hint: use the firebase service
    // getSuggestedProfiles
    // call the async function (from this firebase service) within useEffect
    // store it in state
    // go ahead and render (wait on the profiles as in 'skeleton')

    return !profiles ? (
        <Skeleton count={1} height={150} className='wt-5' />
    ) : profiles.length > 0 ? (
        <div className='rounded flex flex-col'>
            <div className='text-sm flex items-center align-items justify-between mb-2'>
                <p className='font-bold text-gray-base'>Connect with others</p>
            </div>
            <div className='mt-4 grip gap-5'>
                {profiles.map((profile) => (
                    <SuggestedProfile
                        imageSrc={profile.imageSrc}
                        key={profile.docId}
                        profileDocId={profile.docId}
                        username={profile.username}
                        profileId={profile.userId}
                        userId={userId}
                        loggedInUserDocId={loggedInUserDocId}
                    />
                ))}
            </div>
        </div>
    ) : null;
}

Suggestions.propTypes = {
    userId: PropTypes.string,
    following: PropTypes.array,
    loggedInUserDocId: PropTypes.string,
};
