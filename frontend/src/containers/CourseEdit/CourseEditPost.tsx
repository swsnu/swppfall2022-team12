/* global kakao */

import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';

import KakaoMap from '../../components/Map/KakaoMap';
import { AppDispatch } from '../../store';
import { postCourse } from '../../store/slices/course';
import { TagType, selectTag, fetchTags } from '../../store/slices/tag';
import { MarkerProps, PositionProps } from './CourseEditSearch';

export default function PostCourse() {
  const { id } = useParams();
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
  const [tagsToSubmit, setTagsToSubmit] = useState<number[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tags = useSelector(selectTag);

  const { state } = useLocation();

  useEffect(() => {
    axios.get(`/course/${id}/`).then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
    });
    setMarkers(state.selected);
    setPath(state.path);
    setExpectedTime(Number((state.resultData.totalTime / 60).toFixed(0)));
    setDistance(Number((state.resultData.totalDistance / 1000).toFixed(1)));
    setFare(Number(state.resultData.totalFare));
    dispatch(fetchTags());
    axios.get(`/course/${id}/`).then((res) => {
        //tag fetch
        setSelectedTags(res.data.tags);
      });
    
  }, []);

  const mapBounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();

    markers.forEach((point) => {
      bounds.extend(new kakao.maps.LatLng(point.position.lat, point.position.lng));
    });
    return bounds;
  }, [markers]);

  useEffect(() => {
    if (markers) map?.setBounds(mapBounds, 200, 0, 50, 500);
    
  }, [markers]);

  const handleSubmitCourse = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setTagsToSubmit(
        selectedTags.map(st =>{ return tags.tags.find((t)=>{if(t.content===st) return true; else false;})?.id! })
    );
    console.log(tagsToSubmit);
    const data = {
      title,
      description,
      category: 'drive',
      e_time: expectedTime,
      distance,
      path,
      markers,
      tags: tagsToSubmit,
    };
    try {
      axios.put(`/course/${id}/`, data);
      navigate(`/courses/`);
    } catch (error) {
      alert('ERROR');
    }
    // const result = await dispatch(postCourse(data));
    // if (result.type === `${postCourse.typePrefix}/fulfilled`) {
    //   navigate('/courses');
    // }
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
        <button style={{ backgroundColor: 'white' }} onClick={handleSubmitCourse}>
          <h3>경로 완성</h3>
        </button>
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
        <label>
          Title
          <input
            style={{ marginRight: '30px' }}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </label>
        <label>
          Description
          <input
            style={{ marginRight: '30px' }}
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </label>
        <div>
          tags
          <select
            onChange={(e) => {
              setSelectedTags([...selectedTags, e.target.value]);
              setTagsToSubmit(
                [...selectedTags, e.target.value].map(st => { return tags.tags.find((t)=>{if(t.content===st) return true; else false;})?.id! })
              );
              console.log(tagsToSubmit);
            }}
          >
            {tags.tags.map((t) => {
              return (
                <option key={t.id} value={t.content}>
                  {t.content}
                </option>
              );
            })}
          </select>
          <div>{selectedTags.toString()}</div>
        </div>
        <label style={{ marginRight: '30px' }}>total fare : {`${fare} 원`}</label>
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
