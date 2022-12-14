/* global kakao */

import { Button, Input, Card, Col, Row, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import KakaoMap from '../../components/Map/KakaoMap';
import { AppDispatch } from '../../store';
import { postCourse } from '../../store/slices/course';
import { selectTag } from '../../store/slices/tag';
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tagList = useSelector(selectTag);

  const { state } = useLocation();

  const mapBounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();

    markers.forEach((point) => {
      bounds.extend(new kakao.maps.LatLng(point.position.lat, point.position.lng));
    });
    return bounds;
  }, [markers]);

  useEffect(() => {
    setMarkers(state.selected);
    setPath(state.path);
    setExpectedTime(Number((state.resultData.totalTime / 60).toFixed(0)));
    setDistance(Number((state.resultData.totalDistance / 1000).toFixed(1)));
    setFare(Number(state.resultData.totalFare));
  }, []);

  useEffect(() => {
    if (markers) map?.setBounds(mapBounds, 200, 0, 50, 500);
  }, [markers]);

  const handleChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleClose = (tag: string) => {
    const removed = selectedTags.filter((item) => item !== tag);
    setSelectedTags(removed);
  };

  const handleSubmitCourse = async (e: React.MouseEvent<HTMLElement>) => {
    if (title.length === 0 || title.length > 100) {
      toast.warning('????????? 100 ????????? ??????????????????');
      if (description.length < 10 || description.length > 1000) {
        toast.warning('????????? 10??? ??????, 1000??? ????????? ??????????????????');
      }
      return;
    }
    e.preventDefault();
    const finalTags = selectedTags.map((tag) => tagList.tags.find((t) => t.content === tag)?.id!);
    const data = {
      title,
      description,
      category: 'drive',
      e_time: expectedTime,
      distance,
      path,
      markers,
      tags: finalTags,
    };
    // console.log({ data });
    // try {
    //   await dispatch(postCourse(data));
    //   navigate('/courses');
    // } catch (error) {
    //   alert('ERROR');
    // }
    const result = await dispatch(postCourse(data));
    if (result.type === `${postCourse.typePrefix}/fulfilled`) {
      navigate('/courses');
    } else {
      toast.error('?????? ????????? ??????????????????');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
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
            height: 50,
            boxShadow:
              'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
          }}
          size="large"
          onClick={handleSubmitCourse}
        >
          <h4 style={{ margin: 0 }}>?????? ??????</h4>
        </Button>
      </div>
      <div
        className="Container"
        style={{
          width: '700px',
          height: '100vh',
          zIndex: 1,
          backgroundColor: 'white',
        }}
      >
        <div style={{ margin: '30px 30px 0 30px' }}>
          <div style={{ marginBottom: '50px' }}>
            <h3 style={{ textAlign: 'left' }}>??????</h3>
            <TextArea
              style={{ marginRight: '30px' }}
              placeholder="????????? ??????????????????"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoSize
            />
          </div>
          <div style={{ marginBottom: ' 50px' }}>
            <h3 style={{ textAlign: 'left' }}>??????</h3>
            <TextArea
              style={{ marginRight: '30px' }}
              placeholder="?????? ??????????????????"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              rows={4}
            />
          </div>
          <div className="Tags" style={{ height: '100px' }}>
            ??????
            <Select
              mode="tags"
              placeholder="????????? ??????????????????"
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              {tagList.tags.map((item) => (
                <Select.Option key={item.id} value={item.content} onClose={handleClose}>
                  {item.content}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="site-card-wrapper">
            <Row gutter={15}>
              <Col>
                <Card
                  title="??? ??????"
                  size="small"
                  headStyle={{ backgroundColor: '#a0d911' }}
                  style={{ width: '200px' }}
                >
                  {fare} ???
                </Card>
              </Col>
              <Col>
                <Card
                  title="?????? ?????? ??????"
                  size="small"
                  headStyle={{ backgroundColor: '#91caff' }}
                  style={{ width: '200px' }}
                >
                  {expectedTime >= 60
                    ? `${(expectedTime / 60).toFixed(0)}?????? ${expectedTime % 60}`
                    : expectedTime}
                  ???
                </Card>
              </Col>
              <Col>
                <Card
                  title="??? ??????"
                  size="small"
                  headStyle={{ backgroundColor: '#ff85c0' }}
                  style={{ width: '200px' }}
                >
                  {distance} km
                </Card>
              </Col>
            </Row>
          </div>
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
