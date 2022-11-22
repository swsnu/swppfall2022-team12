import { Button } from '@mui/material';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch } from '../../store';
import { loginUser } from '../../store/slices/user';

export default function LoginTab() {
  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);

  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  const onClickLogin = () => {
    if (emailInput === '' && emailInputRef.current != null) {
      emailInputRef.current.focus();
      return;
    }
    if (passwordInput === '' && pwInputRef.current != null) {
      pwInputRef.current.focus();
      return;
    }
    // dispatch(loginUser(useremailInput, passwordInput));
    navigate('/main');
  };

  return (
    <div
      id="login-tab"
      style={{
        width: '500px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <div
        className="login-input"
        style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <label>
          Email
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            ref={emailInputRef}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            ref={pwInputRef}
          />
        </label>
      </div>
      <Button onClick={onClickLogin}>Login</Button>
    </div>
  );
}
