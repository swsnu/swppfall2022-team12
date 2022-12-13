import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import LoginTab from '../../components/LoginTab/LoginTab';
import SignUpTab from '../../components/SignUpTab/SignUpTab';
import Logo from '../../img/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
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
        alignItems: 'center',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate('/main')}
        style={{ marginTop: '150px', marginBottom: '75px' }}
      >
        <Logo />
      </div>
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
