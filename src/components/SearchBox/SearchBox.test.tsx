import { getByRole, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import SearchBox from "./SearchBox";

import { store } from '../../store';
import { Provider } from 'react-redux';
import { getMockStore, renderWithProviders } from '../../test-utils/mocks';
import { courseSlice } from "../../store/slices/course";

// const initialState = {
//     course: {
//         courses: [],
//         selectedCourse: null,
//     }
// };

// const mockStore = getMockStore({ ...initialState });

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    Navigate: (props: any) => {
        mockNavigate(props.to);
        return null;
    },
    useNavigate: () => mockNavigate,
}));

describe("<SearchBox />", () => {
    it("should render without errors", () => {
        renderWithProviders(<SearchBox searchKey={null}/>);
        screen.getByPlaceholderText("Search Courses");
        const searchButton = screen.getByText("Search");
        expect(searchButton).toBeInTheDocument();
    });

    it("should handle onClickSearch when input is empty", async () => {
        renderWithProviders(<SearchBox searchKey={null}/>);
        const searchInput = screen.getByPlaceholderText("Search Courses");
        const searchButton = screen.getByText("Search");

        fireEvent.click(searchButton);
        expect(searchInput).toEqual(document.activeElement);

        fireEvent.change(searchInput, {target: {value: "TEST"}});

    });

    it("should handle onClickSearch when input is not empty", async () => {
        renderWithProviders(<SearchBox searchKey={null}/>);
        const searchInput = screen.getByPlaceholderText("Search Courses");
        const searchButton = screen.getByText("Search");

        fireEvent.change(searchInput, { target: { value: "TEST" }});
        await screen.findByDisplayValue("TEST");

        fireEvent.click(searchButton);
        await waitFor(() => expect(localStorage.getItem("SEARCH_KEY")).toEqual("TEST"));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));
    });
})