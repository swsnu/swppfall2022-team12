import { createAsyncThunk, createSlice, isRejected, PayloadAction } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import axios, { AxiosRequestHeaders } from 'axios';

import { RootState } from '../index';

interface TagType {
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
  users: Pick<UserType, 'email' | 'username' | 'tags'>[];
  loggedInUser: Pick<UserType, 'email' | 'username' | 'tags'> | null;
  selectedUser: Pick<UserType, 'email' | 'username' | 'tags'> | null;
}

const initialUserState: UserState = {
  users: [],
  loggedInUser: null,
  selectedUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
  },
  extraReducers: (builder) => {},
});

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
