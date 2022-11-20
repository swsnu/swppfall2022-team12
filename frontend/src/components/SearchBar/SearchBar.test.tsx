import { fireEvent, render, screen } from '@testing-library/react';

import { PositionProps } from '../../containers/CourseCreate/SearchCourse';
import SearchBar from './SearchBar';

describe('<SearchBar />', () => {
  it('should render without errors', () => {
    render(
      <SearchBar
        markers={[]}
        selected={[]}
        searchPlaces={jest.fn()}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
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
      />,
    );
    const result = screen.getByText('TEST1');
    fireEvent.mouseEnter(result);
    expect(setInfo).toHaveBeenCalled();
    fireEvent.mouseLeave(result);
    expect(setInfo).toHaveBeenCalled();
  });
});
