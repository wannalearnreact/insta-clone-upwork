// if the user is logged in allow him to get to certain routes
import React from "react";
import PropTypes from 'prop-types';
import {Route, Navigate} from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function ProtectedRoute({ user, children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (user) {     // if there is a user
                    return children // return the timeline they're logged in
                    // if there is a user, allow the children to be showed. In app.js
                    // the children is Dashboard, which is inside <ProtectedRoute>

                }

                if (!user) {
                    return (
                        <Navigate
                            to={{
                                pathname: ROUTES.LOGIN,
                                state: { from: location }   //I'm gonna redirect you to login and you're comming from 'this location'
                            }}
                        />
                    )
                }

                return null
            }}
        />
    )
}

ProtectedRoute.propTypes = {
    user: PropTypes.object,
    children: PropTypes.object.isRequired
}