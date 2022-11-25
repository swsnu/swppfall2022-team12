import { configureStore } from '@reduxjs/toolkit';

import courseReducer from './slices/course';
import tagReducer from './slices/tag';
import userReducer from './slices/user';

export const store = configureStore({
  reducer: {
    course: courseReducer,
    user: userReducer,
    tag: tagReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
