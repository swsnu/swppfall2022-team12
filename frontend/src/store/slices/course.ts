import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from '../index';

export interface CourseType {
  id: number;
  title: string;
  description: string;
  created_at: string;
  // grade: number;
  // f_count: number;
  u_counts: number;
  distance: number;
  e_time: string;
  startPos: number | null;
  passPos: number[] | null;
  endPos: number | null;
}

export interface FetchCoursesParams {
  page: number;
  category: string;
  search_keyword: string | null;
  filter: string | null;
}

export interface CourseState {
  courses: CourseType[];
  selectedCourse: CourseType | null;
}

const initialCourseState: CourseState = {
  courses: [],
  selectedCourse: null,
};

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (props: FetchCoursesParams) => {
    const response = await axios.get<CourseType[]>('/course/', { params: props });
    return response.data;
  },
);

export const fetchCourse = createAsyncThunk('coures/fetchCourse', async (id: CourseType['id']) => {
  const response = await axios.get<CourseType>(`/course/${id}/`);
  return response.data ?? null;
});

export const courseSlice = createSlice({
  name: 'course',
  initialState: initialCourseState,
  reducers: {
    // fetchCourses: (state, action) => {
    //   state.courses = action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
    builder.addCase(fetchCourse.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });
  },
});

export const courseAction = courseSlice.actions;
export const selectCourse = (state: RootState) => state.course;

export default courseSlice.reducer;
