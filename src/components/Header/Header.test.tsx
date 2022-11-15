import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Header from "./Header";

import { store } from '../../store';
import { Provider } from 'react-redux';
import { getMockStore, renderWithProviders } from '../../test-utils/mocks';
import { courseSlice } from "../../store/slices/course";

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
    beforeAll(() => console.error = jest.fn());
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors", () => {
        renderWithProviders(<Header />);
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

    it("should handle onClickCategory when button is clicked", async () => {
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
        
        renderWithProviders(<Header />);
        localStorage.clear();
        // const mockFetchCourses = jest.spyOn(courseSlice, "fetchCourses");

        const driveButton = screen.getByText("드라이브");
        fireEvent.click(driveButton);
        await waitFor(() => expect(localStorage.getItem("CATEGORY_KEY")).toEqual("drive"));
        await waitFor(() => expect(localStorage.getItem("SEARCH_KEY")).toEqual(null));
        await waitFor(() => expect(localStorage.getItem("FILTER")).toEqual(null));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));

        const bikeButton = screen.getByText("바이크");
        fireEvent.click(bikeButton);
        await waitFor(() => expect(localStorage.getItem("CATEGORY_KEY")).toEqual("bike"));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));

        const cycleButton = screen.getByText("자전거");
        fireEvent.click(cycleButton);
        await waitFor(() => expect(localStorage.getItem("CATEGORY_KEY")).toEqual("cycle"));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));

        const runButton = screen.getByText("런닝");
        fireEvent.click(runButton);
        await waitFor(() => expect(localStorage.getItem("CATEGORY_KEY")).toEqual("run"));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));
    });
});