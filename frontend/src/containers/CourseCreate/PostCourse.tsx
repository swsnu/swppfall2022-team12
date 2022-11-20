import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import KakaoMap from '../../components/Map/KakaoMap';
import { AppDispatch } from '../../store';
import { postCourse, selectCourse } from '../../store/slices/course';
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

  const dispatch = useDispatch<AppDispatch>();
  const courseState = useSelector(selectCourse);
  const navigate = useNavigate();

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

  const handleSubmitCourse = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const data = {
      title,
      description,
      category: 'drive',
      e_time: expectedTime,
      distance,
      path,
      markers,
    };
    const result = await dispatch(postCourse(data));
    if (result.type === `${postCourse.typePrefix}/fulfilled`) {
      navigate('/courses');
    }
  };

  return (
    <div>
      <div
        className="buttons"
        style={{
          zIndex: 1,
          position: 'fixed',
          right: '10px',
          margin: '10px',
        }}
      >
        <button style={{ backgroundColor: 'white' }} onClick={handleSubmitCourse}>
          <h3>경로 완성</h3>
        </button>
      </div>
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
