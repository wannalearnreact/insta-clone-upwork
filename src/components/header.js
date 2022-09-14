//no need to explain anything

import React, { useContext } from 'react';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';

import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

import { useNavigate } from 'react-router-dom';
import Avatar, { AvatarVariants } from './avatar';
import { fireAuth } from '../firebase_settings/firebase';
import { useEffect } from 'react';
import useUser from '../hooks/use-user';
import profilePlaceholder from '../resources/profile-placeholder.svg';
//react icons
import { AiFillHome, AiOutlineLogout } from 'react-icons/ai';
import { IoIosAddCircle } from 'react-icons/io';

export default function Header() {
    // get imageSrc to be displayed in the header icon
    const { user } = useContext(UserContext);
    const {
        user: { imageSrc },
    } = useUser();

    const navigate = useNavigate();

    return (
        <header className='h-20 bg-white border-b border-gray-primary mb-8 pb-2'>
            <div className='container mx-auto max-w-screen-lg h-full'>
                <div className='flex justify-between h-full'>
                    <div
                        className='text-gray-700 text-center flex items-center align-items
                    cursor-pointer w-20 '
                    >
                        <div className='flex justify-center w-full '>
                            <Link to={ROUTES.DASHBOARD}>
                                <img
                                    src='/images/logo.png'
                                    alt='logo'
                                    className='mt-2 w-12 h-12 rounded-full  border-4 border-solid border-gray-500 '
                                />
                            </Link>
                        </div>
                    </div>

                    <div className='text-gray-700 text-center flex items-center align-items'>
                        {user ? (
                            <>
                                <Link to={ROUTES.DASHBOARD}>
                                    <AiFillHome
                                        className='mr-3'
                                        color='black'
                                        size={40}
                                    />
                                </Link>

                                <Link to={ROUTES.ADD_IMAGE}>
                                    <IoIosAddCircle
                                        className='mr-3'
                                        color='black'
                                        size={45}
                                    />
                                </Link>

                                <button
                                    type='button'
                                    title='Sign Out'
                                    onClick={() => {
                                        fireAuth.signOut();
                                        navigate(ROUTES.LOGIN);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            fireAuth.signOut();
                                            navigate(ROUTES.LOGIN);
                                        }
                                    }}
                                >
                                    <AiOutlineLogout
                                        className=' mr-3'
                                        color='black'
                                        size={40}
                                    />
                                </button>

                                <div className='flex items-center cursor-pointer '>
                                    <Link to={`/p/${user.displayName}`}>
                                        {/*  <Avatar
                                            variant={AvatarVariants.extraSmall}
                                            src={imageSrc}
                                        /> */}
                                        <img
                                            src={
                                                imageSrc
                                                    ? imageSrc
                                                    : profilePlaceholder
                                            }
                                            alt='Avatar'
                                            className='w-10 h-10 rounded-full object-cover mr-4'
                                        />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to={ROUTES.LOGIN}>
                                    <button
                                        type='button'
                                        className='bg-blue-medium
                                        font-bold text-sm rounded text-white w-20 h-8'
                                    >
                                        Log In
                                    </button>
                                </Link>
                                <Link to={ROUTES.SIGN_UP}>
                                    <button
                                        type='button'
                                        className='font-bold text-sm rounded text-blue-medium
                                        w-20 h-8'
                                    >
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
