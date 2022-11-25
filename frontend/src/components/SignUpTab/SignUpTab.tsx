import { Button } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch, store } from '../../store';
import { signupUser, selectUser, UserType } from '../../store/slices/user';

export default function SignUpTab() {
  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const userState = useSelector(selectUser);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef1 = useRef<HTMLInputElement>(null);
  const pwInputRef2 = useRef<HTMLInputElement>(null);

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [checkPwInput, setCheckPwInput] = useState<string>('');

  const onClickSignUpButton = async () => {
    if (usernameInput === '' && nameInputRef.current != null) {
      nameInputRef.current.focus();
      return;
    }
    if (emailInput === '' && emailInputRef.current != null) {
      emailInputRef.current.focus();
      return;
    }
    if (passwordInput === '' && pwInputRef1.current != null) {
      pwInputRef1.current.focus();
      return;
    }
    if ((checkPwInput === '' || passwordInput !== checkPwInput) && pwInputRef2.current != null) {
      pwInputRef2.current.focus();
      return;
    }

    const req = { username: usernameInput, email: emailInput, password: passwordInput };
    await axios
      .post<Pick<UserType, 'email' | 'username' | 'tags'>>('/user/signup/', req)
      .then((response) => {
        window.sessionStorage.setItem('user', response.data.username);
        window.location.reload();
      })
      .catch((error) => {
        const msg = error.response.data;
        let alertMsg = '';

        if (msg.email) alertMsg += `Email : ${msg.email}\n`;
        if (msg.username) alertMsg += `Username : ${msg.username}\n`;
        if (msg.password) alertMsg += `Password : ${msg.password}\n`;
        alert(alertMsg);
      });
  };

  return (
    <div
      id="signup-tab"
      style={{
        width: '500px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <div
        className="signup-input"
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
            ref={nameInputRef}
          />
        </label>
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
            ref={pwInputRef1}
          />
        </label>
        <label>
          Check Password
          <input
            type="password"
            value={checkPwInput}
            onChange={(e) => setCheckPwInput(e.target.value)}
            ref={pwInputRef2}
          />
        </label>
      </div>
      <Button onClick={onClickSignUpButton}>Sign Up</Button>
    </div>
  );
}
