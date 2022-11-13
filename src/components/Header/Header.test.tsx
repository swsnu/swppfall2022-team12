import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Header from "./Header";

import { store } from '../../store';
import { Provider } from 'react-redux';
import { getMockStore } from '../../test-utils/mocks';
import { courseSlice } from "../../store/slices/course";

const initialState = {
    course: {
        courses: [],
        selectedCourse: null,
    }
};

const mockStore = getMockStore({ ...initialState });

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    Navigate: (props: any) => {
        mockNavigate(props.to);
        return null;
    },
    useNavigate: () => mockNavigate,
}));

describe("<Header />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        render(<Provider store={mockStore}><Header /></Provider>);
        screen.getByText("Course Adviser");
        const driveButton = screen.getByText("드라이브");
        const bikeButton = screen.getByText("바이크");
        const cycleButton = screen.getByText("자전거");
        const runButton = screen.getByText("런닝");
        expect(driveButton).toBeInTheDocument();
        expect(bikeButton).toBeInTheDocument();
        expect(cycleButton).toBeInTheDocument();
        expect(runButton).toBeInTheDocument();
    });

    it("should navigate to list page when each category button is clicked", async () => {
        // jest.spyOn(axios, "get").mockRejectedValueOnce({
        //     data: [{
        //         id: 1,
        //         title: "COURSE_TEST_TITLE1",
        //     description: "COURSE_TEST_DESCRIPTION1",
        // created_at: "00:00",
        // u_counts: 100,
        // distance: 10,
        // e_time: "1:30",
        // startPos: null,
        // passPos: null,
        // endPos: null,
        //     },]
        // });
        
        render(<Provider store={mockStore}><Header /></Provider>);
        // const mockFetchCourses = jest.spyOn(courseSlice, "fetchCourses");

        const driveButton = screen.getByText("드라이브");
        fireEvent.click(driveButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));
        expect(localStorage.getItem("CATEGORY_KEY")).toEqual("drive");

        const bikeButton = screen.getByText("바이크");
        fireEvent.click(bikeButton);
        // expect(localStorage.getItem("SEARCH_KEY")).toEqual(null);
        // expect(localStorage.getItem("FILTER")).toEqual(null);
        // await waitFor(() => expect(axios, "get").toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));
        expect(localStorage.getItem("CATEGORY_KEY")).toEqual("bike");

        const cycleButton = screen.getByText("자전거");
        fireEvent.click(cycleButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));
        expect(localStorage.getItem("CATEGORY_KEY")).toEqual("cycle");

        const runButton = screen.getByText("런닝");
        fireEvent.click(runButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));
        expect(localStorage.getItem("CATEGORY_KEY")).toEqual("run");
    });

    it("should handle onClickCategory", async () => {
        localStorage.setItem("CATEGORY_KEY", "bike");
        render(<Provider store={mockStore}><Header /></Provider>);

        const driveButton = screen.getByText("드라이브");
        fireEvent.click(driveButton);
        expect(localStorage.getItem("SEARCH_KEY")).toEqual(null);
        expect(localStorage.getItem("FILTER")).toEqual(null);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));
    });

});