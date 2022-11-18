import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestHeaders } from 'axios';

import { dummyData } from '../../components/dummyData';
import poisData from '../../components/poisData.json';
import { DataProps, FeatureProps } from '../../containers/CourseCreate/CourseCreate';
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

interface ViaPointType {
  viaPointId: string;
  viaPointName: string;
  viaX: string;
  viaY: string;
}

interface TMapCourseType {
  startName: string;
  startX: string;
  startY: string;
  startTime: string;
  endName: string;
  endX: string;
  endY: string;
  viaPoints: ViaPointType[];
  reqCoordType: string;
  resCoordType: string;
  searchOption: string;
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
  tMapData: DataProps | null;
  tMapFeatures: FeatureProps[];
}

const initialCourseState: CourseState = {
  courses: [],
  selectedCourse: null,
  tMapData: null,
  tMapFeatures: [],
};

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (props: FetchCoursesParams) => {
    const response = await axios.get<CourseType[]>('/course/', { params: props });
    return response.data;
  },
);

export const fetchCourse = createAsyncThunk('course/fetchCourse', async (id: CourseType['id']) => {
  const response = await axios.get<CourseType>(`/course/${id}/`);
  return response.data ?? null;
});

export const fetchPathFromTMap = createAsyncThunk('course/fetchCoursePath', async () => {
  const headers: AxiosRequestHeaders = {
    appKey: process.env.REACT_APP_TMAP_API_KEY ?? '',
    'Content-Type': 'application/json',
  };
  // const response = await axios.post<{ features: FeatureProps[]; properties: DataProps }>(
  //   'https://apis.openapi.sk.com/tmap/routes/routeSequential30?version=1&format=json',
  //   dummyData,
  //   { headers },
  // );
  // return response.data;
  return { features: poisData.features, properties: poisData.properties };
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
    builder.addCase(fetchPathFromTMap.fulfilled, (state, action) => {
      state.tMapData = action.payload.properties;
      state.tMapFeatures = action.payload.features;
    });
  },
});

export const courseAction = courseSlice.actions;
export const selectCourse = (state: RootState) => state.course;

export default courseSlice.reducer;
