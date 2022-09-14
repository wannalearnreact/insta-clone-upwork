// if the user is logged in allow him to get to certain routes
import React from "react";
import PropTypes from 'prop-types';
import { Route, Navigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function UnauthenticatedRoute({ user, children, ...rest }) {
  if (user) {
    return (
      <Navigate
        to={{
          pathname: ROUTES.DASHBOARD,
          state: { from: location }   //I'm gonna redirect you to login and you're comming from 'this location'
        }}
        replace
      />
    )
  }

  return children;
}

UnauthenticatedRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object.isRequired
}