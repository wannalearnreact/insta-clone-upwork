//explain

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserByUserId, getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/Header';
import UserProfile from '../components/profile';

export default function Profile() {
    // 1. we get the username (/p/:username)
    const { username } = useParams(); // destructure out username because in ROUTES we have /p/:username
    // we need to see if user exists
    const [user, setUser] = useState(null);
    const [profileChanged, setProfileChanged] = useState(0);

    const history = useNavigate();

    // 2. check if username exists
    useEffect(() => {
        async function checkUserExists() {
            const [user] = await getUserByUsername(username);
            if (user.userId) {
                setUser(user);
            } else {
                history.push(ROUTES.NOT_FOUND);
            }
        }

        checkUserExists();
    }, [username, history]);

    return user?.username ? (
        <div className='bg-gray-background'>
            <Header />
            <div className='mx-auto max-w-screen-lg '>
                <UserProfile user={user} />
            </div>
        </div>
    ) : null; // if there is no user return null
}
