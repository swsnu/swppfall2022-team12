import { render } from '@testing-library/react';

import KakaoMap from './KakaoMap';

describe('<KakaoMap />', () => {
  it('should render without errors', () => {
    render(
      <KakaoMap
        setMap={jest.fn()}
        searchMarkers={[]}
        path={[]}
        previewMarkers={[]}
        info={null}
        setInfo={jest.fn()}
        addLocation={jest.fn()}
        preview
      />,
    );
  });
  it('should render without errors', () => {
    const previewMarkers = [
      {
        position: { lat: 1, lng: 1 },
        content: 'PREVIEW1',
      },
      {
        position: { lat: 2, lng: 2 },
        content: 'PREVIEW2',
      },
    ];
    const setInfo = jest.fn();

    render(
      <KakaoMap
        setMap={jest.fn()}
        searchMarkers={[]}
        path={[]}
        previewMarkers={previewMarkers}
        info={null}
        setInfo={setInfo}
        addLocation={jest.fn()}
        preview
      />,
    );
  });
});
