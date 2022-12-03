import { Button } from '@mui/material';
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch } from '../../store';
import { UserType, loginUser, selectUser } from '../../store/slices/user';
import { TagType } from '../../store/slices/tag';
export interface LoginResponseType {
  email: string;
  username: string;
  token: {
    access: string;
    refresh: string;
  };
  tags: TagType[];
}
export default function LoginTab() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);

  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  const onClickLogin = async () => {
    if (emailInput === '' && emailInputRef.current != null) {
      emailInputRef.current.focus();
      return;
    }
    if (passwordInput === '' && pwInputRef.current != null) {
      pwInputRef.current.focus();
      return;
    }

    const req = { email: emailInput, password: passwordInput };
    await axios.put<LoginResponseType>(
      '/user/login/',
      req,
    )
    .then((response) => {
      window.sessionStorage.setItem('username', response.data.username);
      window.sessionStorage.setItem('access', response.data.token.access);
      window.sessionStorage.setItem('refresh', response.data.token.refresh);
      window.sessionStorage.setItem('tags', JSON.stringify(response.data.tags));
      window.location.reload();
    })
    .catch((error) => {
      if (error.response.data.detail) alert(error.response.data.detail);
    })
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
