import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';

import KakaoMap from '../../components/Map/KakaoMap';
import { MarkerProps, PositionProps } from './SearchCourse';

export default function PostCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState<number>(0); // km
  const [expectedTime, setExpectedTime] = useState<number>(0); // minute
  const [fare, setFare] = useState<number>(0); // Korean Won
  const [map, setMap] = useState<kakao.maps.Map>();
  const [info, setInfo] = useState<MarkerProps | null>(null);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);

  const { state } = useLocation();

  useEffect(() => {
    setMarkers(state.selected);
    setPath(state.path);
    setExpectedTime(Number((state.resultData.totalTime / 60).toFixed(0)));
    setDistance(Number((state.resultData.totalDistance / 1000).toFixed(1)));
    setFare(Number(state.resultData.totalFare));
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
          style={{ marginRight: '30px' }}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        description :{' '}
        <input
          style={{ marginRight: '30px' }}
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <label style={{ marginRight: '30px' }}>expected time : {`${expectedTime} 분`}</label>
        <label>total distance : {`${distance} km`}</label>
      </div>
      <div style={{ height: '30px' }} />
      <KakaoMap
        setMap={setMap}
        path={path}
        previewMarkers={markers}
        info={info}
        setInfo={setInfo}
        preview
      />
    </div>
  );
}
