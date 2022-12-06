import React, { Component } from 'react';
import { Route, Navigate } from 'react-router-dom';

import isLogin from '../../utils/isLogin';

interface PropsInterface {
  element: JSX.Element;
}

export default function PrivateRoute(props: PropsInterface) {
  const { element } = props;
  return isLogin() ? element : <Navigate to="/login" />;
}
