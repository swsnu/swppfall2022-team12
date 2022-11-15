import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, Navigate } from "react-router";
import axios from "axios";
import MainPage from "./MainPage";
import { getMockStore, renderWithProviders } from "../../test-utils/mocks";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<MainPage />", () => {
    it("should render without errors", () => {
        renderWithProviders(<MainPage />);
        screen.getByText("Main Page");
        screen.getByText("Course Adviser");
        screen.getByText("Search");
        screen.getByText("Create New Course");
    });

    it("should navigate to posting page when clicked create-new-course button", () => {
        renderWithProviders(<MainPage />);
        const createNewCourseButton = screen.getByText("Create New Course");
        fireEvent.click(createNewCourseButton);
        expect(mockNavigate).toHaveBeenCalledWith("search");
    });
});