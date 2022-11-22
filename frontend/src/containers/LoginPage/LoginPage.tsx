import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import LoginTab from '../../components/LoginTab/LoginTab';
import SignUpTab from '../../components/SignUpTab/SignUpTab';

export default function LoginPage() {
  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);

  const onClickSignUpButton = () => {
    setIsLoginTab(false);
  };
  const onClickSignInButton = () => {
    setIsLoginTab(true);
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
      }}
    >
      {isLoginTab ? (
        <div id="login-container">
          <LoginTab />
          New to Course Adviser? <Button onClick={onClickSignUpButton}>Sign up</Button>
        </div>
      ) : (
        <div id="signup-container">
          <SignUpTab />
          Already have an account? <Button onClick={onClickSignInButton}>Sign in</Button>
        </div>
      )}
    </div>
  );
}
