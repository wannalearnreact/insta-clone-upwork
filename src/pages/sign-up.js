//refactor+ explain

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { doesUsernameExist } from '../services/firebase';

export default function SignUp() {
    const history = useNavigate();
    const { firebase } = useContext(FirebaseContext);

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';

    //refactor to V9 firebase
    const handleSignup = async (event) => {
        event.preventDefault();

        const usernameExists = await doesUsernameExist(username);
        if (!usernameExists.length) {
            //if username's length !=0 (?
            try {
                const createdUserResult = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(emailAddress, password);

                //Authentication
                //-> emailAddress & password  & username (dispalyName (así se llama en la autenticacion))
                await createdUserResult.user.updateProfile({
                    displayName: username,
                });

                // firebase user collection (create a document)
                await firebase.firestore().collection('users').add({
                    userId: createdUserResult.user.uid,
                    username: username.toLowerCase(),
                    fullName,
                    emailAddress: emailAddress.toLowerCase(),
                    following: [],
                    dateCreated: Date.now(),
                });

                history(ROUTES.DASHBOARD);
            } catch (error) {
                setFullName('');
                setEmailAddress('');
                setPassword('');
                setError(error.message);
            }
        } else {
            setError('That username is already taken, please try another');
        }
    };

    useEffect(() => {
        document.title = 'Sign Up - Encontrarte';
    }, []);

    return (
        <div
            className='container flex mx-auto max-w-screen-md items-center
        h-screen'
        >
            <div className='flex w-3/5'>
                <img src='/images/icon.png' alt='Icon' />
            </div>
            <div className='flex flex-col w-2/5'>
                <div
                    className='flex flex-col items-center bg-white p-4 border border-gray-primary
                mb-4 rounded '
                >
                    <h1 className='flex justify-center w-full'>
                        <p className='mt-2 w-6/12 mb-4'>Encontrarte</p>
                    </h1>

                    {error && (
                        <p className='mb-4 text-xs text-red-primary'>{error}</p>
                    )}

                    <form onSubmit={handleSignup} method='POST'>
                        <input
                            aria-label='Enter your username'
                            typeof='text'
                            placeholder='Username'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded mb-2'
                            onChange={({ target }) => setUsername(target.value)}
                            value={username}
                        />
                        <input
                            aria-label='Enter your full name'
                            typeof='text'
                            placeholder='Full Name'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded mb-2'
                            onChange={({ target }) => setFullName(target.value)}
                            value={fullName}
                        />
                        <input
                            aria-label='Enter your email address'
                            typeof='text'
                            placeholder='Email address'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded mb-2'
                            onChange={({ target }) =>
                                setEmailAddress(target.value)
                            }
                            value={emailAddress}
                        />
                        <input
                            aria-label='Enter your password'
                            type='password'
                            placeholder='Password'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                        border-gray-primary rounded mb-2'
                            onChange={({ target }) => setPassword(target.value)}
                            value={password}
                            required
                        />
                        <button
                            disabled={isInvalid}
                            type='submit'
                            className={`bg-blue-medium text-white w-full rounded h-8 font-bold
                        ${isInvalid && 'opacity-50'}`}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
                <div
                    className='flex justify-center items-center flex-col w-full bg-white p-4 rounded border
            border-gray-primary'
                >
                    <p className='text-sm'>
                        Have an account?
                        <Link
                            to={ROUTES.LOGIN}
                            className='font-bold text-blue-medium'
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
