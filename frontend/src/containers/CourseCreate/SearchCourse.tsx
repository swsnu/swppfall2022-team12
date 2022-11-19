import React from 'react';

import KakaoMap from '../../components/Map/KakaoMap';
import SearchBar from '../../components/SearchBar/SearchBar';
import { MarkerProps, PositionProps } from './CourseCreate';

type SearchCourseProps = {
  preview: boolean;
  setPreview: (preview: boolean) => void;
  selected: MarkerProps[];
  searchMarkers: MarkerProps[];
  previewMarkers: MarkerProps[];
  path: PositionProps[];
  searchPlaces: (keyword: string) => void;
  addLocation: (marker: MarkerProps) => void;
  info: MarkerProps | null;
  setInfo: (marker: MarkerProps | null) => void;
  setMap: (map: kakao.maps.Map) => void;
};

export default function SearchCourse({
  preview,
  setPreview,
  selected,
  searchMarkers,
  previewMarkers,
  path,
  searchPlaces,
  addLocation,
  info,
  setInfo,
  setMap,
}: SearchCourseProps) {
  return (
    <div className="Container" style={{ display: 'flex', position: 'fixed' }}>
      {/* Buttons */}
      <div
        className="buttons"
        style={{
          zIndex: 1,
          position: 'fixed',
          right: '10px',
          margin: '10px',
        }}
      >
        {preview ? (
          <button
            style={{ backgroundColor: 'white', marginRight: '10px' }}
            onClick={() => setPreview(false)}
          >
            <h3>경로 만들기</h3>
          </button>
        ) : (
          <button
            style={{ backgroundColor: 'white', marginRight: '10px' }}
            onClick={() => setPreview(true)}
          >
            <h3>경로 미리보기</h3>
          </button>
        )}

        <button style={{ backgroundColor: 'white' }}>
          <h3>경로 완성</h3>
        </button>
      </div>
      <SearchBar
        markers={searchMarkers}
        selected={selected}
        searchPlaces={searchPlaces}
        setInfo={setInfo}
        // addLocation={addLocation}
      />
      {/* Display Map */}
      <KakaoMap
        setMap={setMap}
        path={path}
        searchMarkers={searchMarkers}
        previewMarkers={previewMarkers}
        info={info}
        setInfo={setInfo}
        addLocation={addLocation}
        preview={preview}
      />
    </div>
  );
}
