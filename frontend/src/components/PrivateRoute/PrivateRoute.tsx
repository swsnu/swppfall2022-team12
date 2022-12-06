import React, { Component } from 'react';
import { Route, Navigate } from 'react-router-dom';
import isLogin from '../../utils/isLogin';

interface propsInterface {
  element: JSX.Element;
};

const PrivateRoute = (props: propsInterface) => {
  const { element } = props;
    return (
      isLogin() ? element : <Navigate to='/login' />
    );
};

export default PrivateRoute;