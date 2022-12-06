import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestHeaders } from 'axios';

import {
  DataProps,
  FeatureProps,
  MarkerProps,
  PositionProps,
} from '../../containers/CourseCreate/SearchCourse';
import { RootState } from '../index';

export interface CourseType {
  id: number;
  author: string;
  title: string;
  description: string;
  category: string | null;
  created_at: string;
  rate: number;
  // f_count: number;
  u_counts: number;
  e_time: number;
  distance: number;
  path: PositionProps[];
  markers: MarkerProps[];
}

interface ViaPointType {
  viaPointId: string;
  viaPointName: string;
  viaX: string | number;
  viaY: string | number;
}

export interface TMapCourseType {
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
  tags: number[] | null;
}

export interface TaggedCourse {
  tag: number;
  courses: Pick<
    CourseType,
    | 'id'
    | 'author'
    | 'title'
    | 'description'
    | 'created_at'
    | 'u_counts'
    | 'e_time'
    | 'distance'
    | 'rate'
  >[];
}

export interface CourseState {
  courses: CourseType[];
  recommendedCourses: TaggedCourse[];
  selectedCourse: CourseType | null;
  tMapCourse: { tMapData: DataProps | null; tMapFeatures: FeatureProps[] };
}

const initialCourseState: CourseState = {
  courses: [],
  recommendedCourses: [],
  selectedCourse: null,
  tMapCourse: { tMapData: null, tMapFeatures: [] },
};

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (props: FetchCoursesParams) => {
    const response = await axios.get<CourseType[]>('/course/', { params: props });
    return response.data;
  },
);

export const fetchRecommendedCourse = createAsyncThunk(
  'course/fetchRecommendedCourse',
  async () => {
    const response = await axios.get<TaggedCourse[]>('/user/recommend/', {
      headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` },
      params: { category: 'drive' },
    });
    return response.data;
  },
);

export const fetchCourse = createAsyncThunk('course/fetchCourse', async (id: CourseType['id']) => {
  const response = await axios.get<CourseType>(`/course/${id}/`);
  return response.data ?? null;
});

export const postCourse = createAsyncThunk(
  'course/postCourse',
  async (
    course: Pick<
      CourseType,
      'title' | 'description' | 'category' | 'e_time' | 'distance' | 'path' | 'markers'
    >,
  ) => {
    const response = await axios.post<CourseType>(`/course/`, course);
    return response.data;
  },
);

export const fetchPathFromTMap = createAsyncThunk(
  'course/fetchCoursePath',
  async (markers: MarkerProps[]) => {
    let data: TMapCourseType = {
      startName: '',
      startX: '',
      startY: '',
      startTime: '',
      endName: '',
      endX: '',
      endY: '',
      viaPoints: [],
      reqCoordType: 'WGS84GEO',
      resCoordType: 'EPSG3857',
      searchOption: '0',
    };
    const viaPoints: ViaPointType[] = [];
    const len = markers.length;
    let viaCount = 1;
    for (let i = 0; i < len; i += 1) {
      if (i === 0) {
        data = {
          ...data,
          startName: String(markers[i].content),
          startX: String(markers[i].position.lng),
          startY: String(markers[i].position.lat),
          startTime: '201708081102',
        };
      } else if (i === len - 1) {
        data = {
          ...data,
          endName: String(markers[i].content),
          endX: String(markers[i].position.lng),
          endY: String(markers[i].position.lat),
        };
      } else {
        viaPoints.push({
          viaPointId: String(viaCount),
          viaPointName: String(markers[i].content),
          viaX: String(markers[i].position.lng),
          viaY: String(markers[i].position.lat),
        });
        viaCount += 1;
      }
    }
    data = {
      ...data,
      viaPoints,
    };
    const headers: AxiosRequestHeaders = {
      appKey: process.env.REACT_APP_TMAP_API_KEY!,
      'Content-Type': 'application/json',
    };
    const response = await axios.post<{ features: FeatureProps[]; properties: DataProps }>(
      'https://apis.openapi.sk.com/tmap/routes/routeSequential30?version=1&format=json',
      JSON.stringify(data),
      { headers },
    );
    return response.data;
  },
);

export const courseSlice = createSlice({
  name: 'course',
  initialState: initialCourseState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
    builder.addCase(fetchRecommendedCourse.fulfilled, (state, action) => {
      state.recommendedCourses = action.payload ?? [];
    });
    builder.addCase(fetchCourse.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });
    builder.addCase(postCourse.fulfilled, (state, action) => {
      state.courses.push(action.payload);
      state.selectedCourse = action.payload;
    });
    builder.addCase(fetchPathFromTMap.fulfilled, (state, action) => {
      state.tMapCourse.tMapData = action.payload.properties;
      state.tMapCourse.tMapFeatures = action.payload.features;
    });
  },
});

export const courseAction = courseSlice.actions;
export const selectCourse = (state: RootState) => state.course;

export default courseSlice.reducer;
