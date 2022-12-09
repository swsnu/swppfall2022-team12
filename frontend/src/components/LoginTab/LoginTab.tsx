import { Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';

import { TagType } from '../../store/slices/tag';
import { UserType, selectUser } from '../../store/slices/user';

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
  // const dispatch = useDispatch<AppDispatch>();
  // const userState = useSelector(selectUser);

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
    await axios
      .put<LoginResponseType>('/user/login/', req)
      .then((response) => {
        window.sessionStorage.setItem('username', response.data.username);
        window.sessionStorage.setItem('access', response.data.token.access);
        window.sessionStorage.setItem('refresh', response.data.token.refresh);
        window.sessionStorage.setItem('tags', JSON.stringify(response.data.tags));
        navigate('/main');
      })
      .catch((error) => {
        alert(error.response.data.detail ?? '로그인에 실패했습니다.');
      });
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
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="login-email-input">Email</InputLabel>
          <OutlinedInput
            id="login-email-input"
            label="Email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            inputRef={emailInputRef}
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel htmlFor="login-pw-input">Password</InputLabel>
          <OutlinedInput
            id="login-pw-input"
            label="Password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            inputRef={pwInputRef}
          />
        </FormControl>
      </div>
      <Button onClick={onClickLogin}>로그인</Button>
    </div>
  );
}
