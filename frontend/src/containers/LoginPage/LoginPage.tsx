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
        alignItems: 'flex-start',
      }}
    >
      {isLoginTab ? (
        <div id="login-container">
          <LoginTab />
          아직 계정이 없으신가요? <Button onClick={onClickSignUpButton}>회원가입</Button>
        </div>
      ) : (
        <div id="signup-container">
          <SignUpTab />
          이미 계정이 있으신가요? <Button onClick={onClickSignInButton}>로그인</Button>
        </div>
      )}
    </div>
  );
}
