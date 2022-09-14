//no need to explain anything here, everything seems understandable
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import profilePlaceholder from '../../resources/profile-placeholder.svg';
import Avatar, { AvatarVariants } from '../avatar';

export default function Header({ username, imageSrc }) {
    return (
        <div className='flex absolute border-gray-primary h-4 p-4 py-8 mt-6'>
            <div className='flex items-center '>
                <Link to={`/p/${username}`} className='flex items-center'>
                    <img
                        className='rounded-full h-16 w-16 flex  mr-3 border-2 border-white'
                        src={imageSrc ? imageSrc : profilePlaceholder}
                        alt='profile picture'
                    />

                    <p className='font-bold bg-white border-2 border-black rounded-xl p-0.5 capitalize'>
                        {username}
                    </p>
                </Link>
            </div>
        </div>
    );
}
Header.propTypes = {
    username: PropTypes.string.isRequired,
};
