//no need to explain anything

import React, { useContext } from 'react';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import * as Routes from '../constants/routes';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

import { useNavigate } from 'react-router-dom';
export default function Header() {
    const { firebase } = useContext(FirebaseContext);
    const { user } = useContext(UserContext);

    const navigate = useNavigate();
    return (
        <header className='h-16 bg-white border-b border-gray-primary mb-8'>
            <div className='container mx-auto max-w-screen-lg h-full'>
                <div className='flex justify-between h-full'>
                    <div
                        className='text-gray-700 text-center flex items-center align-items
                    cursor-pointer'
                    >
                        <h1 className='flex justify-center w-full'>
                            <Link to={ROUTES.DASHBOARD}>Some random logo</Link>
                        </h1>
                    </div>
                    <div className='text-gray-700 text-center flex items-center align-items'>
                        {user ? (
                            <>
                                <Link
                                    to={ROUTES.DASHBOARD}
                                    arial-label='Dashboard'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2
                                        2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1
                                        1 0 011 1v4a1 1 0 001 1m-6 0h6'
                                        />
                                    </svg>
                                </Link>

                                <Link to={ROUTES.REPORT} arial-label='Report'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                                        />
                                    </svg>
                                </Link>

                                <Link to={ROUTES.MAP} arial-label='Map'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                        />
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                        />
                                    </svg>
                                </Link>

                                <button
                                    type='button'
                                    title='Sign Out'
                                    onClick={() => {
                                        firebase.auth().signOut();
                                        navigate(ROUTES.LOGIN);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            firebase.auth().signOut();
                                            navigate(ROUTES.LOGIN);
                                        }
                                    }}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3
                                        3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                                        />
                                    </svg>
                                </button>

                                <div className='flex items-center cursor-pointer'>
                                    <Link to={`/p/${user.displayName}`}>
                                        <img
                                            className='rounded-full h-8 w-8 flex'
                                            src={`/images/avatars/${user.displayName}.jpg`}
                                            alt={`${user.displayName} profile`}
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
