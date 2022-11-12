import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("<Header />", () => {
    it("should render without errors", () => {
        render(<Header />);
        screen.getByText("Course Adviser");
        const driveButton = screen.getByText("드라이브");
        const bikeButton = screen.getByText("바이크");
        const cycleButton = screen.getByText("자전거");
        const runButton = screen.getByText("런닝");
        expect(driveButton).toBeInTheDocument();
        expect(bikeButton).toBeInTheDocument();
        expect(cycleButton).toBeInTheDocument();
        expect(runButton).toBeInTheDocument();
    })
})