import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import axios, { AxiosRequestHeaders } from 'axios';

import { RootState } from '../index';

export interface TagType {
  id: number;
  content: string;
}

export interface UserType {
  id: number;
  username: string;
  email: string;
  password: string;
  tags: TagType[];
}

export interface UserState {
  users: Pick<UserType, 'email' | 'username'>[];
  loggedInUser: Pick<UserType, 'email' | 'username'> | null;
  selectedUser: Pick<UserType, 'email' | 'username'> | null;
}

const initialUserState: UserState = {
  users: [],
  loggedInUser: null,
  selectedUser: null,
};

export const signupUser = createAsyncThunk(
  'user/signup',
  async (usr: Pick<UserType, 'username' | 'email' | 'password'>, { dispatch }) => {
    const req = { username: usr.username, email: usr.email, password: usr.password };
    const { data } = await axios.post<Pick<UserType, 'email' | 'username'>>('/user/signup/', req);

    return dispatch(userActions.signupUser({ user: data }));
  },
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (usr: Pick<UserType, 'email' | 'password'>, { dispatch }) => {
    const req = { email: usr.email, password: usr.password };
    const { data } = await axios.put<Pick<UserType, 'email' | 'username'>>('/user/login/', req);

    return dispatch(userActions.loginUser({ user: data }));
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (name: UserType["username"], { dispatch }) => {
    const { data } = await axios.get('/user/logout/');
    return dispatch(userActions.logoutUser({ name }));
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    signupUser: (state, action: PayloadAction<{ user: Pick<UserType, 'email' | 'username'> }>) => {
      state.loggedInUser = action.payload.user;
    },
    loginUser: (state, action: PayloadAction<{ user: Pick<UserType, 'email' | 'username'> }>) => {
      state.loggedInUser = action.payload.user;
    },
    logoutUser: (state, action) => {
      state.loggedInUser = null;
    },
  },
});

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
