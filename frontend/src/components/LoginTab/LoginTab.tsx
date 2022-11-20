import { Button } from '@mui/material';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch } from '../../store';
import { loginUser } from '../../store/slices/user';

export default function LoginTab() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const nameInput = useRef<HTMLInputElement>(null);
  const pwInput = useRef<HTMLInputElement>(null);

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  const onClickLogin = () => {
    if (usernameInput === '' && nameInput.current != null) {
      nameInput.current.focus();
      return;
    }
    if (passwordInput === '' && pwInput.current != null) {
      pwInput.current.focus();
      return;
    }
    // dispatch(loginUser(usernameInput, passwordInput));
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
          Username
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            ref={nameInput}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            ref={pwInput}
          />
        </label>
      </div>
      <Button onClick={onClickLogin}>Login</Button>
    </div>
  );
}
