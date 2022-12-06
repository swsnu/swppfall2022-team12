import React, { Component } from 'react';
import { Route, Navigate } from 'react-router-dom';

import isLogin from '../../utils/isLogin';

interface propsInterface {
  component: JSX.Element;
}
function PrivateRoute(props: propsInterface) {
  const { component } = props;
  return isLogin() ? component : <Navigate to="/login" />;
}

export default PrivateRoute;
