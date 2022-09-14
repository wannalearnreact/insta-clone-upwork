//refactor+ explain

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { AuthErrors, signUp } from '../services/firebaseAuth';

export default function SignUp() {
    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';

    const handleSignup = async (event) => {
        event.preventDefault();

        const credentials = {
            emailAddress,
            password,
            username,
            fullName,
        };

        signUp(
            credentials,
            () => history(ROUTES.DASHBOARD),
            ({ type, message }) => {
                if (type === AuthErrors.DATABASE_ERROR) {
                    setFullName('');
                    setEmailAddress('');
                    setPassword('');
                }

                setError("Something's not right, try again !");
            }
        );
    };

    useEffect(() => {
        document.title = 'Sign Up ';
    }, []);

    return (
        <div
            className='container flex mx-auto max-w-screen-md items-center justify-center 
        h-screen font-Roboto'
        >
            <div className='flex flex-col w-2/5  text-center rounded-3xl'>
                <div
                    className='flex flex-col items-center bg-white p-4 border border-gray-primary
                mb-4 rounded-3xl '
                >
                    <h1 className='flex justify-center w-full'>
                        <img
                            src='/images/logo.png'
                            alt='logo'
                            className='w-20 h-20'
                        />
                    </h1>

                    {error && (
                        <p className='mb-4 text-xs text-red-primary'>{error}</p>
                    )}

                    <form onSubmit={handleSignup} method='POST'>
                        <input
                            typeof='text'
                            placeholder='Username'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded-full mb-2'
                            onChange={({ target }) => setUsername(target.value)}
                            value={username}
                        />
                        <input
                            typeof='text'
                            placeholder='Full Name'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded-full mb-2'
                            onChange={({ target }) => setFullName(target.value)}
                            value={fullName}
                        />
                        <input
                            typeof='text'
                            placeholder='Email address'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded-full mb-2'
                            onChange={({ target }) =>
                                setEmailAddress(target.value)
                            }
                            value={emailAddress}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded-full mb-2'
                            onChange={({ target }) => setPassword(target.value)}
                            value={password}
                            required
                        />
                        <button
                            disabled={isInvalid}
                            type='submit'
                            className={`bg-gray-base text-white w-full rounded-full h-10 font-bold text-xl
                        ${isInvalid && 'opacity-50'}`}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
                <div
                    className='flex justify-center items-center flex-col w-full bg-white p-4 rounded-full border
            border-gray-primary'
                >
                    <p className='text-sm'>
                        Have an account?
                        <Link
                            to={ROUTES.LOGIN}
                            className='font-bold text-gray-500 ml-1'
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
