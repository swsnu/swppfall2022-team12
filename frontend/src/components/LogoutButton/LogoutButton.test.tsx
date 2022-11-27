import { getByRole, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

import LogoutButton from "./LogoutButton";


describe("<LogoutButton />", () => {
  const { reload } = window.location;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    // window.location.reload = jest.fn();
  });

  it("should render without errors", () => {
    render(<LogoutButton />);
    screen.getByText("Logout");
  });

  it("should handle onClick withour errors with user in session storage", async () => {
    sessionStorage.setItem("user", "test");
    render(<LogoutButton />);
    const logoutButton = screen.getByText("Logout");

    fireEvent.click(logoutButton);
    await waitFor(() => expect(sessionStorage.getItem("user")).toEqual(null));
    await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
  });

  it("should handle onClick withour errors without user in session storage", async () => {
    render(<LogoutButton />);
    const logoutButton = screen.getByText("Logout");

    fireEvent.click(logoutButton);
    await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
  });

  it("should handle onClick withour errors with axios error", async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    render(<LogoutButton />);
    const logoutButton = screen.getByText("Logout");
    
    fireEvent.click(logoutButton);
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });
});