import React from 'react';

import KakaoMap from '../../components/Map/KakaoMap';
import SearchBar from '../../components/SearchBar/SearchBar';
import { MarkerProps, PositionProps } from './CourseCreate';

type SearchCourseProps = {
  preview: boolean;
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
