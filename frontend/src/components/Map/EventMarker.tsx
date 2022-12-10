import React from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';

import { MarkerProps } from '../../containers/CourseCreate/SearchCourse';

type EventMarkerProps = {
  marker: MarkerProps;
  info: MarkerProps | null;
  setInfo: (marker: MarkerProps | null) => void;
};

export default function EventMarker({ marker, info, setInfo }: EventMarkerProps) {
  return (
    <MapMarker
      position={marker.position} // 마커를 표시할 위치
      onMouseOver={() => setInfo(marker)}
      onMouseOut={() => setInfo(null)}
      image={{
        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        size: {
          width: 33,
          height: 36,
        },
      }}
    >
      {info && info?.content === marker.content && (
        <div style={{ width: '100%', padding: '5px', color: '#000' }}>{marker.content}</div>
      )}
    </MapMarker>
  );
}
