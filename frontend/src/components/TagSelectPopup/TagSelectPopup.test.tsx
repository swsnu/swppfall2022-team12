import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { TagState } from '../../store/slices/tag';
import { getMockStore } from '../../test-utils/mocks';
import TagSelectPopup from './TagSelectPopup';

const tagInitState: TagState = {
  tags: [
    {
      id: 1,
      content: 'test-tag1',
    },
    {
      id: 2,
      content: 'test-tag2',
    }
  ],
  selectedTags: [],
};

const mockStore = getMockStore({
  course: {
    courses: [],
    selectedCourse: null,
    recommendedCourses: [],
    tMapCourse: { tMapData: null, tMapFeatures: [] },
  },
  user: {
    users: [],
    loggedInUser: null,
    selectedUser: null,
  },
  tag: tagInitState,
});

describe("<TagSelectPopup />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without errors", () => {
    render(<Provider store={mockStore}><TagSelectPopup toOpen={true} openHandler={()=>{}}/></Provider>);

    screen.getByText('나의 태그');
    screen.getByText('아래 태그들 중 취향에 맞는 태그들을 선택해주세요!');
    screen.getByText('test-tag1');
    screen.getByText('test-tag2');
  });

  it("should handle chip onClick and onDelete", () => {
    window.sessionStorage.setItem('tags', '[]');
    render(<Provider store={mockStore}><TagSelectPopup toOpen={true} openHandler={()=>{}}/></Provider>);

    fireEvent.click(screen.getByText('test-tag1'));
    expect(screen.getAllByText('test-tag1').length).toEqual(2);
    fireEvent.click(screen.getByTestId('CancelIcon'));
    expect(screen.getAllByText('test-tag1').length).toEqual(1);
  });

  it("should handle openHandler", () => {
    const mockOpenHandler = jest.fn();
    render(<Provider store={mockStore}><TagSelectPopup toOpen={true} openHandler={mockOpenHandler}/></Provider>);

    fireEvent.click(screen.getByTestId('CloseRoundedIcon'));
    expect(mockOpenHandler).toBeCalledWith(false);
    fireEvent.click(screen.getByText('건너뛰기'));
    expect(mockOpenHandler).toBeCalledWith(false);
  });

  it("should handle onComplete", async () => {
    const mockOpenHandler = jest.fn();
    axios.put = jest.fn().mockResolvedValue({
      tags: [1],
    });
    render(<Provider store={mockStore}><TagSelectPopup toOpen={true} openHandler={mockOpenHandler}/></Provider>);

    fireEvent.click(screen.getByText('test-tag1'));
    fireEvent.click(screen.getByText('완료'));
    await waitFor(() => expect(mockOpenHandler).toBeCalledWith(false));
    await waitFor(() => expect(window.sessionStorage.getItem('tags')).toEqual('[1]'));
  });
})