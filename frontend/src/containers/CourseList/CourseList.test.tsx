import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

import CourseList from "./CourseList";
import { CourseProps } from "../../components/CourseListElement/CourseListElement";
import { CourseState } from "../../store/slices/course";
import { getMockStore } from "../../test-utils/mocks";

jest.mock("../../components/CourseListElement/CourseListElement", () => (props: CourseProps) => (
    <div data-testid="spyCourseElement">
        <div>
            <p>{props.id}</p>
            <button onClick={props.showDetail}>{props.title}</button>
            {/* <MuiRating rate={props.grade}/> */}
            <span>{props.grade}</span>
        </div>
        <span> played {props.usageCounts} times</span>
        <span> expected time: {props.expectedTime}</span>
    </div>
));

const courseInitState: CourseState = {
    courses: [
        {
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
        },
        {
            id: 2,
            title: "MOCK_TITLE2",
            description: "MOCK_DESCRIPTION2",
            created_at: "00:00",
            u_counts: 20,
            distance: 2,
            e_time: "2:00",
            startPos: null,
            passPos: null,
            endPos: null,
        }
    ],
    selectedCourse: null,
}

const mockStore = getMockStore({
    course: courseInitState,
});

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<CourseList />", () => {
    beforeAll(() => console.error = jest.fn());
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render CourseList without errors", () => {
        const { container } = render(<Provider store={mockStore}><CourseList /></Provider>);
        screen.getByText("Courses List");
        screen.getByText("Course Adviser");
        expect(screen.getAllByText("드라이브").length).toEqual(2);
        screen.getByText("Search");
        screen.getByLabelText("Filter");
        container.getElementsByClassName("course-list");
    });

    it("should render category name", () => {
        localStorage.setItem("CATEGORY_KEY", "bike");
        render(<Provider store={mockStore}><CourseList /></Provider>);
        screen.getByText("바이크 라이드");
        
        localStorage.setItem("CATEGORY_KEY", "cycle");
        render(<Provider store={mockStore}><CourseList /></Provider>);
        screen.getByText("자전거 라이드");
        
        localStorage.setItem("CATEGORY_KEY", "run");
        render(<Provider store={mockStore}><CourseList /></Provider>);
        screen.getByText("런닝/산책");

        localStorage.setItem("CATEGORY_KEY", "invalid key");
        render(<Provider store={mockStore}><CourseList /></Provider>);
        screen.getByText("Invalid");
    });

    it("should render courses", () => {
        render(<Provider store={mockStore}><CourseList /></Provider>);
        const courses = screen.getAllByTestId("spyCourseElement");
        expect(courses[0]).toHaveTextContent("MOCK_TITLE1");
        expect(courses[1]).toHaveTextContent("MOCK_TITLE2");
    });

    it("should handle clickTitle", async () => {
        render(<Provider store={mockStore}><CourseList /></Provider>);
        const course1 = screen.getAllByTestId("spyCourseElement")[0];
        const title = course1.querySelector("button");
        fireEvent.click(title!);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/course/1"));
    })
})