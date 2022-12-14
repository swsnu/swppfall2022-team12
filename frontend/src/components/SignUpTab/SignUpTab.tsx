import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export interface SignUpResponseType {
  email: string;
  username: string;
  token: {
    access: string;
    refresh: string;
  };
}

export default function SignUpTab() {
  const navigate = useNavigate();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef1 = useRef<HTMLInputElement>(null);
  const pwInputRef2 = useRef<HTMLInputElement>(null);

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [checkPwInput, setCheckPwInput] = useState<string>('');
  const [ageInput, setAgeInput] = useState<string>('10');
  const [genderInput, setGenderInput] = useState<string>('male');

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

    const req = {
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
      ages: parseInt(ageInput, 10),
      gender: genderInput,
    };
    await axios
      .post<SignUpResponseType>('/api/user/signup/', req)
      .then((response) => {
        window.sessionStorage.setItem('username', response.data.username);
        window.sessionStorage.setItem('access', response.data.token.access);
        window.sessionStorage.setItem('refresh', response.data.token.refresh);
        window.sessionStorage.setItem('tags', '[]');
        navigate('/main');
      })
      .catch((error) => {
        const msg = error.response.data;
        let alertMsg = '';

        if (msg.email) alertMsg += `Email : ${msg.email}\n`;
        if (msg.username) alertMsg += `Username : ${msg.username}\n`;
        if (msg.password) alertMsg += `Password : ${msg.password}\n`;
        toast.error(alertMsg);
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
        gap: '1em',
      }}
    >
      <div
        className="signup-input"
        style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="signup-name-input">Username</InputLabel>
          <OutlinedInput
            id="signup-name-input"
            label="Username"
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            inputRef={nameInputRef}
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel htmlFor="signup-email-input">Email</InputLabel>
          <OutlinedInput
            id="signup-email-input"
            label="Email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            inputRef={emailInputRef}
          />
        </FormControl>
        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="signup-pw-input">Password</InputLabel>
          <OutlinedInput
            id="signup-pw-input"
            label="Password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            inputRef={pwInputRef1}
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel htmlFor="signup-check-pw-input">Check Password</InputLabel>
          <OutlinedInput
            id="signup-check-pw-input"
            label="Check Password"
            type="password"
            value={checkPwInput}
            onChange={(e) => setCheckPwInput(e.target.value)}
            inputRef={pwInputRef2}
          />
        </FormControl>
      </div>
      <div
        className="signup-input"
        style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '1em',
        }}
      >
        <FormControl sx={{ minWidth: 150 }} size="small" margin="normal">
          <InputLabel id="age-input-label">Age</InputLabel>
          <Select
            data-testid="age-input-testId"
            labelId="age-input-label"
            id="age-input-select"
            label="Age"
            defaultValue={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
          >
            <MenuItem value={10}>10s</MenuItem>
            <MenuItem value={20}>20s</MenuItem>
            <MenuItem value={30}>30s</MenuItem>
            <MenuItem value={40}>40s</MenuItem>
            <MenuItem value={50}>50s</MenuItem>
            <MenuItem value={60}>60s</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="gender-input-label">Gender</InputLabel>
          <Select
            data-testid="gender-input-testId"
            labelId="gender-input-label"
            id="gender-input-select"
            label="Gender"
            defaultValue={genderInput}
            onChange={(e) => setGenderInput(e.target.value)}
          >
            <MenuItem value="male">??????</MenuItem>
            <MenuItem value="female">??????</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button onClick={onClickSignUpButton}>????????????</Button>
    </div>
  );
}
