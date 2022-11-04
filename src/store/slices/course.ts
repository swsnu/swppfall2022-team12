import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { RootState } from "..";

export interface CourseType {
    id: number;
    title: string;
    description: string;
    grade: number;
    f_count: number;
    u_count: number;
    start_pos: number | null;
    pass_pos: number[] | null;
    end_pos: number | null;
}

export interface CourseState {
    courses: CourseType[];
    filteredCourses: CourseType[];
    selectedCourse: CourseType | null;
}

const initialCourseState: CourseState = {
    courses: [],
    filteredCourses: [],
    selectedCourse: null,
}

export const fetchCourses = createAsyncThunk(
    "course/fetchCourses",
    async () => {
        const response = await axios.get<CourseType[]>("/api/courses/");
        return response.data;
    }
);

// export const fetchFilteredCourses = createAsyncThunk(
//     "coures/fetchFilteredCourses",
//     async (category: string, searchKey: string) => {
//         if (category != "") {
//             const 
//         }
//     }
// )
