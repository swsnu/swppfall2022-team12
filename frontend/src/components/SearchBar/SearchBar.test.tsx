import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  mockGetComputedStyle,
  mockDndSpacing,
  makeDnd,
  DND_DIRECTION_UP,
} from 'react-beautiful-dnd-test-utils';

import SearchBar from './SearchBar';

const verifyTaskOrderInColumn = (columnTestId: string, orderedTasks: string[]): void => {
  const texts = within(screen.getByTestId(columnTestId))
    .getAllByTestId('task')
    .map((x) => x.textContent);
  expect(texts).toEqual(orderedTasks);
};

describe('<SearchBar />', () => {
  it('should render without errors', () => {
    render(
      <SearchBar
        markers={[]}
        selected={[]}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
        removeLocation={jest.fn()}
        handleDrag={jest.fn()}
        preview
      />,
    );
  });
  it('should searchPlaces when click search with keyword ', () => {
    render(
      <SearchBar
        markers={[]}
        selected={[]}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
        removeLocation={jest.fn()}
        handleDrag={jest.fn()}
        preview
      />,
    );
    const keywordInput = screen.getByPlaceholderText('검색어를 입력해주세요');
    const searchButton = screen.getByText('검색');
    fireEvent.change(keywordInput, { target: { value: 'TEST' } });
    fireEvent.click(searchButton!);
  });
  it('should alert when keyword is empty', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <SearchBar
        markers={[]}
        selected={[]}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
        removeLocation={jest.fn()}
        handleDrag={jest.fn()}
        preview
      />,
    );
    const searchButton = screen.getByText('검색');
    fireEvent.click(searchButton!);
    expect(window.alert).toHaveBeenCalled();
  });
  it('should render selected places', () => {
    const selected = [
      {
        position: { lat: 1, lng: 1 },
        content: 'TEST1',
      },
      {
        position: { lat: 2, lng: 2 },
        content: 'TEST2',
      },
    ];
    render(
      <SearchBar
        markers={[]}
        selected={selected}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
        removeLocation={jest.fn()}
        handleDrag={jest.fn()}
        preview
      />,
    );
  });
  it('should render markers', () => {
    const markers = [
      {
        position: { lat: 1, lng: 1 },
        content: 'TEST1',
      },
      {
        position: { lat: 2, lng: 2 },
        content: 'TEST2',
      },
    ];
    const setInfo = jest.fn();
    render(
      <SearchBar
        markers={markers}
        selected={[]}
        searchPlaces={jest.fn()}
        setInfo={setInfo}
        addLocation={jest.fn()}
        removeLocation={jest.fn()}
        handleDrag={jest.fn()}
        preview
      />,
    );
    const result = screen.getByText('TEST1');
    fireEvent.mouseEnter(result);
    expect(setInfo).toHaveBeenCalled();
    fireEvent.mouseLeave(result);
    expect(setInfo).toHaveBeenCalled();
  });
  it('should work addLocation', () => {
    const markers = [
      {
        position: { lat: 1, lng: 1 },
        content: 'TEST1',
      },
      {
        position: { lat: 2, lng: 2 },
        content: 'TEST2',
      },
    ];
    const addLocation = jest.fn();
    render(
      <SearchBar
        markers={markers}
        selected={[]}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={addLocation}
        removeLocation={jest.fn()}
        handleDrag={jest.fn()}
        preview
      />,
    );
    const result = screen.getByText('TEST1');
    fireEvent.click(result);
    expect(addLocation).toHaveBeenCalled();
  });
  it('should work removeLocation', () => {
    const selected = [
      {
        position: { lat: 1, lng: 1 },
        content: 'TEST1',
      },
    ];
    const removeLocation = jest.fn();
    render(
      <SearchBar
        markers={[]}
        selected={selected}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
        removeLocation={removeLocation}
        handleDrag={jest.fn()}
        preview={false}
      />,
    );
    const removeButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(removeButton);
    expect(removeLocation).toHaveBeenCalled();
  });

  it('should work dragging list item', async () => {
    const selected = [
      {
        position: { lat: 1, lng: 1 },
        content: 'TEST1',
      },
      {
        position: { lat: 2, lng: 2 },
        content: 'TEST2',
      },
    ];
    mockGetComputedStyle();
    const { container } = render(
      <SearchBar
        markers={[]}
        selected={selected}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
        removeLocation={jest.fn()}
        handleDrag={jest.fn()}
        preview={false}
      />,
    );
    mockDndSpacing(container);
    await makeDnd({
      text: 'TEST2',
      direction: DND_DIRECTION_UP,
      positions: 1,
    });

    verifyTaskOrderInColumn('selected', ['TEST2', 'TEST1']);
  });
});
