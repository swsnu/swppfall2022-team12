/* global kakao */

import React from 'react';
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';

import { PositionProps, MarkerProps } from '../../containers/CourseCreate/CourseCreate';

type MapProps = {
  // map: kakao.maps.Map | undefined;
  setMap: (map: kakao.maps.Map) => void;
  path: PositionProps[];
  searchMarkers: MarkerProps[];
  previewMarkers: MarkerProps[];
  info: MarkerProps | null;
  setInfo: (marker: MarkerProps | null) => void;
  addLocation: (marker: MarkerProps) => void;
  preview: boolean;
};

function KakaoMap({
  setMap,
  searchMarkers,
  path,
  previewMarkers,
  info,
  setInfo,
  addLocation,
  preview,
}: MapProps) {
  return (
    <div>
      {preview ? (
        <Map // 지도를 표시할 Container
          center={{
            // 지도의 중심좌표
            lat: 37.405278291509404,
            lng: 127.12074279785197,
          }}
          style={{
            // 지도의 크기
            width: '100%',
            height: '100%',
            right: '0px',
            position: 'fixed',
          }}
          level={3} // 지도의 확대 레벨
          onCreate={setMap}
        >
          <Polyline
            path={[path]}
            strokeWeight={5} // 선의 두께 입니다
            strokeColor="red" // 선의 색깔입니다
            strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle="solid" // 선의 스타일입니다
          />
          {previewMarkers.map((marker, idx) => (
            <div className={`marker${idx}`}>
              <MapMarker
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                image={{
                  src: marker.image ?? '',
                  size: {
                    width: 24,
                    height: 38,
                  },
                }}
                onMouseOver={() => setInfo(marker)}
                onMouseOut={() => setInfo(null)}
              >
                {info && info.content === marker.content && (
                  <div style={{ color: '#000' }}>{marker.content}</div>
                )}
              </MapMarker>
            </div>
          ))}
        </Map>
      ) : (
        <Map
          center={{
            lat: 37.566826,
            lng: 126.9786567,
          }}
          style={{
            width: '100%',
            height: '100%',
            right: '0px',
            position: 'fixed',
          }}
          level={3}
          onCreate={setMap}
        >
          {searchMarkers.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onMouseOver={() => setInfo(marker)}
              onMouseOut={() => setInfo(null)}
              onClick={() => addLocation(marker)}
            >
              {info && info?.content === marker.content && (
                <div style={{ color: '#000' }}>{marker.content}</div>
              )}
            </MapMarker>
          ))}
        </Map>
      )}
    </div>
  );
}

export default React.memo(KakaoMap);
