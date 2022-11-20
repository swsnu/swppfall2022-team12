import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

export default function SignUpTab() {
  const navigate = useNavigate();
  const nameInput = useRef<HTMLInputElement>(null);
  const pwInput1 = useRef<HTMLInputElement>(null);
  const pwInput2 = useRef<HTMLInputElement>(null);

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [checkPwInput, setCheckPwInput] = useState<string>('');

  const onClickSignUpButton = () => {
    if (usernameInput === '' && nameInput.current != null) {
      nameInput.current.focus();
      return;
    }
    if (passwordInput === '' && pwInput1.current != null) {
      pwInput1.current.focus();
      return;
    }
    if (checkPwInput === '' && pwInput2.current != null) {
      pwInput2.current.focus();
      return;
    }

    navigate('/main');
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
            ref={nameInput}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            ref={pwInput1}
          />
        </label>
        <label>
          Check Password
          <input
            type="password"
            value={checkPwInput}
            onChange={(e) => setCheckPwInput(e.target.value)}
            ref={pwInput2}
          />
        </label>
      </div>
      <Button onClick={onClickSignUpButton}>Sign Up</Button>
    </div>
  );
}
