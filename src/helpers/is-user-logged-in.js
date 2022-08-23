//no need to explain because im not using this file, i tried using it and it didnt work, same with protected route, so i decided not to have it in the code

// if the user is logged in allow him to get to certain routes
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Navigate } from 'react-router-dom';

// 7. We do a conditional check to see if the user is logged in
// If he isn't return standard children
// If he is, fly them to dashboard
export default function IsUserLoggedIn({
    user,
    loggedInPath,
    children,
    ...rest
}) {
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (!user) {
                    // if there is a user
                    return children;
                }

                if (user) {
                    return (
                        <Navigate
                            to={{
                                pathname: loggedInPath,
                                state: { from: location }, //I'm gonna redirect you to login and you're comming from 'this location'
                            }}
                        />
                    );
                }

                return null;
            }}
        />
    );
}

IsUserLoggedIn.propTypes = {
    user: PropTypes.object,
    loggedInPath: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
};
