import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import UserContext from './context/user';
import useAuthListener from './hooks/use-auth-listener';
import ProtectedRoute from './helpers/protected-route';
import IsUserLoggedIn from './helpers/is-user-logged-in';

const Login = lazy(() => import('./pages/Login')); // Lazy allows me to load only what I need and not everything at once
const Signup = lazy(() => import('./pages/SignUp')); // example. I only need Sign up so only sign up loads. Why would dashb, profile, etc load as well if I only need sign up?
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AddImage = lazy(() => import('./pages/AddImage'));

export default function App() {
    // 2. we have a AuthListener which basically has the displayName and userId
    // 3. We bring in protected routes and IsUserLoggedIn
    // 3.1 IsUserLoggedIn allows you to navigate a user elsewhere if they're logged in
    // so If I go to the login page and I'm already logged in, it's gonna send me back to dashboard
    const { user } = useAuthListener();

    return (
        <UserContext.Provider value={{ user }}>
            <Router>
                <Suspense fallback={<p>Loading...</p>}>
                    <Routes>
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.SIGN_UP} element={<Signup />} />
                        <Route path={ROUTES.PROFILE} element={<Profile />} />
                        <Route
                            path={ROUTES.DASHBOARD}
                            element={<Dashboard />}
                        />
                        <Route path='*' element={<NotFound />} />
                        <Route path={ROUTES.ADD_IMAGE} element={<AddImage />} />
                    </Routes>
                </Suspense>
            </Router>
        </UserContext.Provider>
    );
}
