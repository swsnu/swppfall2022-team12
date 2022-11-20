import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { ThunkMiddleware } from 'redux-thunk';

import {
  DataProps,
  FeatureProps,
  MarkerProps,
  PositionProps,
} from '../../containers/CourseCreate/SearchCourse';
import reducer, {
  CourseState,
  CourseType,
  fetchCourses,
  fetchCourse,
  fetchPathFromTMap,
} from './course';

describe('course reducer', () => {
  let store: EnhancedStore<
    { course: CourseState },
    AnyAction,
    [ThunkMiddleware<{ course: CourseState }, AnyAction, undefined>]
  >;
  const mockCourse: CourseType = {
    id: 1,
    title: 'MOCK_TITLE1',
    description: 'MOCK_DESCRIPTION1',
    category: 'DRIVE',
    created_at: '00:00',
    u_counts: 10,
    distance: 1,
    e_time: 300,
    path: [],
    markers: [],
  };
  const mockMarkers: MarkerProps[] = [
    { position: { lat: 10, lng: 20 }, content: 'TEST1' },
    { position: { lat: 11, lng: 21 }, content: 'TEST2' },
    { position: { lat: 12, lng: 22 }, content: 'TEST3' },
  ];
  const mockTMapCourse: { properties: DataProps; features: FeatureProps } = {
    properties: {
      totalDistance: '10',
      totalTime: '10',
      totalFare: '10',
    },
    features: {
      type: 'FeatureCollection',
      geometry: {
        type: 'Point',
        coordinates: [14149070.04179341, 4495385.72777567],
      },
      properties: {
        index: '0',
        viaPointId: '',
        viaPointName: '[0] 출발지',
        arriveTime: '20220808110200',
        completeTime: '20220808110200',
        distance: '10',
        deliveryTime: '20',
        waitTime: '30',
        pointType: 'S',
      },
    },
  };

  beforeAll(() => {
    store = configureStore({ reducer: { course: reducer } });
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown ' })).toEqual({
      courses: [],
      selectedCourse: null,
      tMapCourse: { tMapData: null, tMapFeatures: [] },
    });
  });

  it('should handle fetchCourses', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [mockCourse] });
    const mockFetchParam = {
      page: 1,
      category: 'drive',
      search_keyword: null,
      filter: null,
    };

    await store.dispatch(fetchCourses(mockFetchParam));
    expect(store.getState().course.courses).toEqual([mockCourse]);
  });

  it('should handle fetchPathFromTMap', async () => {
    axios.post = jest.fn().mockResolvedValue({ data: mockTMapCourse });
    await store.dispatch(fetchPathFromTMap(mockMarkers));
    expect(store.getState().course.tMapCourse.tMapData).toEqual(mockTMapCourse.properties);
    expect(store.getState().course.tMapCourse.tMapFeatures).toEqual(mockTMapCourse.features);
  });

  it('should handle fetchCourse', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockCourse });
    await store.dispatch(fetchCourse(1));
    expect(store.getState().course.selectedCourse).toEqual(mockCourse);
  });

  it('should handle null on fetchCourse', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: null });
    await store.dispatch(fetchCourse(100));
    expect(store.getState().course.selectedCourse).toEqual(null);
  });
});
