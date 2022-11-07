import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

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
    start_pos: number | null;
    pass_pos: number[] | null;
    end_pos: number | null;
}

export interface fetchCoursesParams {
    page: number;
    category: string;
    search_keyword: string | null;
    filter: string | null;
}

export interface CourseState {
    courses: CourseType[];
    // filteredCourses: CourseType[];
    selectedCourse: CourseType | null;
}

const initialCourseState: CourseState = {
    courses: [],
    // filteredCourses: [],
    selectedCourse: null,
}

export const fetchCourses = createAsyncThunk(
    "course/fetchCourses",
    async (props: fetchCoursesParams) => {
        // const { page, category, search_keyword, filter } = props;
        console.log(props.category);
        const response = await axios.get<CourseType[]>("/course/", {params: props});
        return response.data;
    }
);

export const fetchCourse = createAsyncThunk(
    "coures/fetchCourse",
    async (id: CourseType["id"]) => {
        const response = await axios.get<CourseType>(`/course/${id}/`);
        return response.data;
    }
);

export const courseSlice = createSlice({
    name: "course",
    initialState: initialCourseState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCourses.fulfilled, (state, action) => {
            state.courses = action.payload;
        });
        builder.addCase(fetchCourse.fulfilled, (state, action) => {
            state.selectedCourse = action.payload;
        });
    }
});

export const courseAction = courseSlice.actions;
export const selectCourse = (state: RootState) => state.course;

export default courseSlice.reducer;
