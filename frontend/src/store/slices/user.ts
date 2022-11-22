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
  users: UserType[];
  loggedInUser: UserType | null;
  selectedUser: UserType | null;
}

const initialUserState: UserState = {
  users: [],
  loggedInUser: null,
  selectedUser: null,
};

export const signupUser = createAsyncThunk(
  'user/signup',
  async (usr: Pick<UserType, 'username' | 'email' | 'password'>) => {
    const req = { username: usr.username, email: usr.email, password: usr.password };
    const { data } = await axios.post<UserType>('/signup/', req);
    
  }
)

export const loginUser = createAsyncThunk(
  'user/login',
  async (usr: Pick<UserType, 'email' | 'password'>, { dispatch }) => {
    const req = { email: usr.email, password: usr.password };
    const { data } = await axios.put<UserType>('/signin/', req);
    // dispatch(userActions.loginUser({ id: UserType['id'], username: UserType['username'], password: UserType{'password'} }))
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (id: UserType['id'], { dispatch }) => {
    const { data } = await axios.put<UserType>(`/signout/${id}`);
    // dispatch(userActions.logoutUser({ targetId: id }));
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    signupUser: (state, action: PayloadAction<{ user: UserType }>) => {
      state.loggedInUser = action.payload.user;
    },
    loginUser: (state, action: PayloadAction<{ user: UserType }>) => {
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
