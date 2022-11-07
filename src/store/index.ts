import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./slices/course";

export const store = configureStore({
    reducer: {
        course: courseReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
