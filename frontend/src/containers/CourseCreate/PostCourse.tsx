/* global kakao */

import { yellow } from '@mui/material/colors';
import { Button, Input, Card, Col, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import KakaoMap from '../../components/Map/KakaoMap';
import { AppDispatch } from '../../store';
import { postCourse } from '../../store/slices/course';
import { MarkerProps, PositionProps } from './SearchCourse';

const { TextArea } = Input;

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
    if (map) {
      map.setBounds(mapBounds, 400, 50, 100, 50);
    }
  }, [map]);

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
    try {
      await dispatch(postCourse(data));
      navigate('/courses');
    } catch (error) {
      alert('ERROR');
    }
    // const result = await dispatch(postCourse(data));
    // if (result.type === `${postCourse.typePrefix}/fulfilled`) {
    //   navigate('/courses');
    // }
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
        <Button
          style={{
            marginRight: 15,
            height: 50,
            boxShadow:
              'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
          }}
          size="large"
          onClick={handleSubmitCourse}
        >
          <h4 style={{ margin: 0 }}>경로 완성</h4>
        </Button>
      </div>
      <div>
        <div>
          Title
          <TextArea
            style={{ marginRight: '30px' }}
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoSize
          />
        </div>
        <div>
          Description
          <TextArea
            style={{ marginRight: '30px' }}
            placeholder="글을 작성해주세요"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows={4}
          />
        </div>
        <div className="site-card-wrapper">
          <Row gutter={10}>
            <Col span={4}>
              <Card
                title="총 요금"
                size="small"
                headStyle={{ backgroundColor: '#a0d911' }}
                style={{ width: '200px' }}
              >
                {`${fare} 원`}
              </Card>
            </Col>
            <Col span={4}>
              <Card
                title="예상 소요 시간"
                size="small"
                headStyle={{ backgroundColor: '#91caff' }}
                style={{ width: '200px' }}
              >
                {`${expectedTime} 분`}
              </Card>
            </Col>
            <Col span={4}>
              <Card
                title="총 거리"
                size="small"
                headStyle={{ backgroundColor: '#ff85c0' }}
                style={{ width: '200px' }}
              >
                {`${distance} km`}
              </Card>
            </Col>
          </Row>
        </div>
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
