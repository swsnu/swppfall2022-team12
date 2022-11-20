import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import axios, { AxiosRequestHeaders } from 'axios';

import { RootState } from '../index';

export interface UserType {
  id: number;
  username: string;
  password: string;
}

export interface UserState {
  users: UserType[];
  loggedInUser: UserType | null;
  selectedUser: UserType | null;
}

const initialUserState: UserState = {
  users: [],
  loggedInUser: null,
  selectedUser: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (usr: Pick<UserType, 'username' | 'password'>, { dispatch }) => {
    const req = { username: usr.username, password: usr.password };
    const response = await axios.put('/signin', req);
    // dispatch(userActions.loginUser({ id: UserType['id'], username: UserType['username'], password: UserType{'password'} }))
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (id: UserType['id'], { dispatch }) => {
    const data = (await axios.get<UserType>(`/api/user/${id}`)).data;
    await axios.put(`/api/user/${id}`, { ...data, logged_in: false });
    // dispatch(userActions.logoutUser({ targetId: id }));
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ user: UserType }>) => {
      state.loggedInUser;
    },
    // logoutUser: (state, action: PayloadAction<>)
  },
});

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
