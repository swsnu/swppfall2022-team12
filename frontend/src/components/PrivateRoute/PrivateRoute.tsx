import React, { Component } from 'react';
import { Route, Navigate } from 'react-router-dom';

import isLogin from '../../utils/isLogin';

interface PrivateProp {
  component: JSX.Element;
}
function PrivateRoute(props: PrivateProp) {
  const { component } = props;
  return isLogin() ? component : <Navigate to="/login" />;
}

export default PrivateRoute;
