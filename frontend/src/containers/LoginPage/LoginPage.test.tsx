import { fireEvent, render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { renderWithProviders } from "../../test-utils/mocks";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<LoginPage />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without errors", () => {
    render(<LoginPage />);

    screen.getByText("Login");
    screen.getByText("New to Course Adviser?");
    screen.getByText("Sign up");
  });

  it("should switch login tab and signup tab", () => {
    render(<LoginPage />);

    const signupTabButton = screen.getByText("Sign up");
    fireEvent.click(signupTabButton);
    screen.getByText("Check Password");

    const loginTabButton = screen.getByText("Sign in");
    fireEvent.click(loginTabButton);
    screen.getByText("New to Course Adviser?");
  });
})