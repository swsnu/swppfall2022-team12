import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import { useLocation } from 'react-router';

import { MarkerProps, PositionProps } from './SearchCourse';

export default function PostCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState([]);
  const [expectedTime, setExpectedTime] = useState(0);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [info, setInfo] = useState<MarkerProps | null>(null);
  const [page, setPage] = useState(true);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);

  const { state } = useLocation();

  useEffect(() => {
    setMarkers(state.selected);
    setPath(state.path);
  }, []);

  const mapBounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();

    markers.forEach((point) => {
      bounds.extend(new kakao.maps.LatLng(point.position.lat, point.position.lng));
    });
    return bounds;
  }, [markers]);

  useEffect(() => {
    if (map) map.setBounds(mapBounds, 400, 50, 100, 50);
  });

  return (
    <div>
      <div>
        Title :{' '}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        description :{' '}
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        expected time :{' '}
        <input
          type="text"
          value={expectedTime}
          onChange={(e) => {
            setExpectedTime(Number(e.target.value));
          }}
        />
      </div>
      <div style={{ height: '30px' }} />
      <Map // 지도를 표시할 Container
        key="kakao-map"
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
        {markers?.map((marker, idx) => (
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
    </div>
  );
}
