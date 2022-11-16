import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";

import reducer, { CourseState, CourseType, fetchCourses, fetchCourse} from "./course";

describe("course reducer", () => {
    let store: EnhancedStore<
        { course: CourseState },
        AnyAction,
        [ThunkMiddleware<{ course: CourseState }, AnyAction, undefined>]
    >;
    const mockCourse: CourseType = {
        id: 1,
        title: "MOCK_TITLE1",
        description: "MOCK_DESCRIPTION1",
        created_at: "00:00",
        u_counts: 10,
        distance: 1,
        e_time: "1:00",
        startPos: null,
        passPos: null,
        endPos: null,
    }

    beforeAll(() => {
        store = configureStore(
            { reducer : { course: reducer } }
        );
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown "})).toEqual({
            courses: [],
            selectedCourse: null,
        });
    });

    it("should handle fetchCourses", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [mockCourse]});
        const mockFetchParam = {
            page: 1,
            category: "drive",
            search_keyword: null,
            filter: null,
        }

        await store.dispatch(fetchCourses(mockFetchParam));
        expect(store.getState().course.courses).toEqual([mockCourse]);
    });

    it("should handle fetchCourse", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: mockCourse });
        await store.dispatch(fetchCourse(1));
        expect(store.getState().course.selectedCourse).toEqual(mockCourse);
    });

    it("should handle null on fetchCourse", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: null });
        await store.dispatch(fetchCourse(100));
        expect(store.getState().course.selectedCourse).toEqual(null);
    });
})