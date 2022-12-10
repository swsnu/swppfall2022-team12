import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from '../index';

export interface TagType {
  id: number;
  content: string;
}

export interface TagState {
  tags: TagType[];
  selectedTags: TagType[];
}

const initialTagState: TagState = {
  tags: [],
  selectedTags: [],
};

export const fetchTags = createAsyncThunk('tag/fetchTags', async () => {
  const response = await axios.get<TagType[]>('/api/tag/');
  return response.data;
});

export const tagSlice = createSlice({
  name: 'tag',
  initialState: initialTagState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags = action.payload;
    });
  },
});

export const selectTag = (state: RootState) => state.tag;

export default tagSlice.reducer;
