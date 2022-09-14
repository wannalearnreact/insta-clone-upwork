// no need to explain anything

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { signIn } from '../services/firebaseAuth';

export default function Login() {
    const history = useNavigate();
    const { firebase } = useContext(FirebaseContext);

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';

    const handleLogin = async (event) => {
        event.preventDefault();

        signIn(
            { emailAddress, password },
            () => history(ROUTES.DASHBOARD),
            (err) => {
                setEmailAddress('');
                setPassword('');
                setError(err);
            }
        );
    };

    useEffect(() => {
        document.title = 'Login';
    }, []);

    return (
        <div className='container flex mx-auto max-w-screen-md items-center justify-center h-screen font-Roboto '>
            <div className='flex flex-col w-2/5 text-center'>
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

                    <form onSubmit={handleLogin} method='POST'>
                        <input
                            typeof='text'
                            placeholder='Email address'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded-full  mb-2'
                            onChange={({ target }) =>
                                setEmailAddress(target.value)
                            }
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded-full mb-2'
                            onChange={({ target }) => setPassword(target.value)}
                            required
                        />
                        <button
                            disabled={isInvalid}
                            type='submit'
                            className={`bg-gray-base text-white w-full rounded-full h-10 font-bold  text-xl
                        ${isInvalid && 'opacity-50'}`}
                        >
                            Log In
                        </button>
                    </form>
                </div>
                <div
                    className='flex justify-center items-center flex-col w-full bg-white p-4 rounded-full border
            border-gray-primary'
                >
                    <p className='text-sm'>
                        Dont have an account?
                        <Link
                            to={ROUTES.SIGN_UP}
                            className='font-bold text-gray-500 ml-1'
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
