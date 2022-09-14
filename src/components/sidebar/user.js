//no need to explain anything

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import Avatar, { AvatarVariants } from '../avatar';
import profilePlaceholder from '../../resources/profile-placeholder.svg';
import useUser from '../../hooks/use-user';

function User({ username, fullName }) {
    // do we have the username and fullName?

    const { user } = useUser();
    return (
        <>
            {!username || !fullName ? (
                <Skeleton count={1} height={61} />
            ) : (
                <Link
                    to={`/p/${username}`}
                    className='grid grid-cols-4 mb-6 items-center'
                >
                    <div className='flex items-center justify-between col-span-1'>
                        <img
                            className='rounded-full w-16 h-16 flex mr-3 object-cover'
                            src={
                                user.imageSrc
                                    ? user.imageSrc
                                    : profilePlaceholder
                            }
                            alt=''
                        />
                    </div>
                    <div className='col-span-3'>
                        <p className='font-bold text-sm capitalize'>
                            {username}
                        </p>
                        <p className='text-sm capitalize'>{fullName}</p>
                    </div>
                </Link>
            )}
        </>
    );
}
export default User;

User.propTypes = {
    username: PropTypes.string,
    fullName: PropTypes.string,
};
