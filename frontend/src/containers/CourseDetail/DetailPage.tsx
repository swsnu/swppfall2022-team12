import { Button, Divider, Select, Tag, List } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import KakaoMap from '../../components/Map/KakaoMap';
import MuiRating from '../../components/MuiRate/MuiRating';
import ReviewElement from '../../components/ReviewElement/ReviewElement';
import ReviewPost from '../../components/ReviewPost/ReviewPost';
import { MarkerProps, PositionProps } from '../CourseCreate/SearchCourse';

const ReviewFilters = [
  { value: '최신 순', label: '&filter=time_desc' },
  { value: '오래된 순', label: '&filter=time_asc' },
  { value: '평점 높은 순', label: '&filter=rate_desc' },
  { value: '평점 낮은 순', label: '&filter=rate_desc' },
  { value: '좋아요 순', label: '&filter=likes' },
];
const TagColor = [
  'blue',
  'magenta',
  'red',
  'lime',
  'green',
  'cyan',
  'volcano',
  'orange',
  'gold',
  'geekblue',
  'purple',
];
export default function CourseDetail() {
  type ReviewProps = {
    id: number;
    content: string;
    likes: number;
    author: string;
    rate: number;
    created_at: string;
  };
  const navigate = useNavigate();

  const { id } = useParams(); // get the id of the course
  const [info, setInfo] = useState<MarkerProps | null>(null);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [title, setTitle] = useState('dummy title');
  const [rating, setRating] = useState(4.7);
  const [rateNum, setRateNum] = useState(19);
  const [description, setDescription] = useState('dummy description');
  const [points, setPoints] = useState([]);
  const [destination, setDestination] = useState('dummy destination');
  const [changeInside, setChangeInside] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [u_counts, setCounts] = useState(45);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [e_time, setTime] = useState(50);
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  // const [fare, setFare] = useState<number>(0);
  // const [created_at, setCreateAt] = useState("");
  // const [link, setLink] = useState("");
  const [element, setElement] = useState({
    content: '[0] 출발지',
    image: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
    position: {
      lat: '37.40268656668587',
      lng: '127.10325874620656',
    },
    idx: 0,
  });
  const [reviewList, setReviewList] = useState<ReviewProps[]>([]);
  const [reviewState, setReviewState] = useState<string>('');

  useEffect(() => {
    axios.get(`/api/course/${id}/`).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setTime(res.data.e_time);
      setCounts(res.data.u_counts);
      setPoints(res.data.markers);
      setMarkers(res.data.markers);
      setPath(res.data.path);
      setTags(res.data.tags);
      setRating(res.data.rate);
      setAuthor(res.data.author);
      setDistance(res.data.distance);
      // setFare(res.data.fare);
    });
  }, [changeInside]);

  useEffect(() => {
    axios.get(`/api/review/?course=${id}${reviewState}`).then((res) => {
      console.log(res);
      setReviewList(res.data);
      setRateNum(res.data.length);
    });
  }, [reviewState, changeInside]);

  const mapBounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();

    markers?.forEach((point) => {
      bounds.extend(new kakao.maps.LatLng(point.position.lat, point.position.lng));
    });
    return bounds;
  }, [markers]);

  useEffect(() => {
    if (markers) map?.setBounds(mapBounds, 200, 0, 50, 500);
  }, [markers]);

  const onPlay = () => {
    axios.get(`/api/course/${id}/play/`).then((res) => {
      console.log(res);
    });
    const tempArray = ['nmap://navigation?'];
    const elementArray = [
      {
        content: '[0] 출발지',
        image: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
        position: {
          lat: '37.40268656668555',
          lng: '127.10325874620656',
        },
      },
    ];
    for (let index = 0; index < points.length; index += 1) {
      elementArray.push(points[index]);
    }
    for (let index = 0; index < points.length - 1; index += 1) {
      tempArray.push(
        `&v${index + 1}lat=${elementArray[index + 1].position.lat}&v${index + 1}lng=${
          elementArray[index + 1].position.lng
        }&v${index + 1}name=${encodeURIComponent(elementArray[index + 1].content.toString())}`,
      );
    }

    const a = `dlat=${elementArray[points.length].position.lat}&dlng=${
      elementArray[points.length].position.lng
    }&dname=${encodeURIComponent(elementArray[points.length].content.toString())}`;
    tempArray.splice(1, 0, a);

    tempArray.push('&appname=com.example.myapp');

    window.location.href = tempArray.toString().replace(/,/g, '');
  };

  const handleChange = (filter: string) => {
    const state = ReviewFilters.find((item) => filter === item.value);
    if (state) setReviewState(state.label);
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
        {author !== window.sessionStorage.getItem('username') && (
          <Button
            style={{
              height: 50,
              boxShadow:
                'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
            }}
            size="large"
            onClick={() => {
              navigate(`/course/edit-search/${id}/`);
            }}
          >
            <h4 style={{ margin: 0 }}>경로 수정</h4>
          </Button>
        )}
      </div>
      <div
        className="Container"
        style={{
          position: 'fixed',
          width: '600px',
          height: '100vh',
          zIndex: 1,
          backgroundColor: 'white',
          textAlign: 'center',
          boxShadow:
            'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
        }}
      >
        <div style={{ margin: '30px 30px 0 30px' }}>
          <div>
            <h2 style={{ margin: '10px 0' }}>{title}</h2>
          </div>
          <div className="Tags" style={{ height: '30px' }}>
            {tags.map((tag, idx) => (
              <Tag color={TagColor[11 % idx]}>{tag}</Tag>
            ))}
          </div>
          <h6 style={{ margin: '5px' }}>{u_counts} 명이 이 코스를 방문했어요!</h6>
          <h6 style={{ margin: '0' }}>
            <MuiRating rate={rating} /> {rating} 점({rateNum}명이 평가했어요)
          </h6>
          <div style={{ margin: '50px 20px', height: '5vh' }}>
            <p>{description}</p>
          </div>

          <div className="site-card-wrapper">
            <div
              className="info"
              style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}
            >
              <p>
                <strong>예상 소요 시간</strong> : {`${e_time} 분`}
              </p>
              <p>
                <strong>총 거리</strong> : {`${distance} km`}
              </p>
            </div>
          </div>
          <Button type="primary" onClick={onPlay}>
            네이버지도앱에 경로표시
          </Button>
          <Divider orientation="left" style={{ margin: 0 }}>
            <h3>리뷰</h3>
          </Divider>
          <ReviewPost courseId={id} setChange={setChangeInside} />
          <div style={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
            <Select placeholder="필터 선택" onChange={handleChange} style={{ width: '120px' }}>
              {ReviewFilters.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div
            style={{
              marginLeft: '20px',
            }}
          >
            <List style={{ overflow: 'auto', height: '35vh' }}>
              {reviewList.map((prop) => {
                return (
                  <ReviewElement
                    key={prop.id}
                    id={prop.id}
                    content={prop.content}
                    likes={prop.likes}
                    author={prop.author}
                    rate={prop.rate}
                    created_at={prop.created_at}
                    change={changeInside}
                    setChange={setChangeInside}
                  />
                );
              })}
            </List>
          </div>
        </div>
      </div>
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
