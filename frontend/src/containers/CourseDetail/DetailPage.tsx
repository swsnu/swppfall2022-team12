import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Divider, Select, Tag, List, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import KakaoMap from '../../components/Map/KakaoMap';
import MuiRating from '../../components/MuiRate/MuiRating';
import ReviewElement, { formatDate } from '../../components/ReviewElement/ReviewElement';
import ReviewPost from '../../components/ReviewPost/ReviewPost';
import { AppDispatch } from '../../store';
import { deleteCourse } from '../../store/slices/course';
import { MarkerProps, PositionProps } from '../CourseCreate/SearchCourse';

const ReviewFilters = [
  { value: '최신 순', label: '&filter=time_desc' },
  { value: '오래된 순', label: '&filter=time_asc' },
  { value: '평점 높은 순', label: '&filter=rate_desc' },
  { value: '평점 낮은 순', label: '&filter=rate_desc' },
  { value: '좋아요 순', label: '&filter=likes' },
];
export const TagColor = [
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

type ReviewProps = {
  id: number;
  content: string;
  likes: number;
  author: string;
  rate: number;
  created_at: string;
};

export default function CourseDetail() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<MarkerProps | null>(null);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [title, setTitle] = useState('dummy title');
  const [rating, setRating] = useState(4.7);
  const [rateNum, setRateNum] = useState(19);
  const [createdAt, setCreatedAt] = useState('');
  const [description, setDescription] = useState('dummy description');
  const [points, setPoints] = useState([]);
  const [changeInside, setChangeInside] = useState<number>(0);
  const [usageCounts, setUsageCounts] = useState(45);
  const [expectedTime, setExpectedTime] = useState(50);
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  const [reviewList, setReviewList] = useState<ReviewProps[]>([]);
  const [reviewState, setReviewState] = useState<string>('');

  const { id } = useParams(); // get the id of the course

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/course/${id}/`).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setExpectedTime(res.data.e_time);
      setUsageCounts(res.data.u_counts);
      setPoints(res.data.markers);
      setMarkers(res.data.markers);
      setPath(res.data.path);
      setTags(res.data.tags);
      setRating(res.data.rate);
      setAuthor(res.data.author);
      setDistance(res.data.distance);
      setCreatedAt(res.data.created_at);
      // setFare(res.data.fare);
    });
  }, [changeInside]);

  useEffect(() => {
    axios.get(`/api/review/?course=${id}${reviewState}`).then((res) => {
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
    axios.get(`/api/course/${id}/play/`).then(() => {});
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

  const handleDelete = async () => {
    if (id) {
      const result = await dispatch(deleteCourse(Number(id)));
      if (result.type === `${deleteCourse.typePrefix}/fulfilled`) {
        navigate('/courses');
      } else {
        toast.error('코스 삭제에 실패했습니다');
      }
    }
  };

  const ModalTitle = useCallback(
    () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ErrorOutlineIcon sx={{ color: '#e64a4a' }} fontSize="large" />
        코스를 삭제하시겠습니까?
      </div>
    ),
    [],
  );

  return (
    <div style={{ display: 'flex' }}>
      <Modal
        title={<ModalTitle />}
        open={isModalOpen}
        cancelText="닫기"
        onCancel={() => setIsModalOpen(false)}
        okText="삭제"
        okButtonProps={{ danger: true }}
        onOk={handleDelete}
      />
      {author === window.sessionStorage.getItem('username') && (
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
            onClick={() => {
              navigate(`/course/edit-search/${id}/`);
            }}
          >
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
              수정
              <EditIcon fontSize="small" />
            </h4>
          </Button>
          <Button
            danger
            style={{
              height: 50,
              boxShadow:
                'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
            }}
            size="large"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
              삭제
              <DeleteIcon fontSize="small" />
            </h4>
          </Button>
        </div>
      )}
      <div
        className="Container"
        style={{
          position: 'fixed',
          width: '600px',
          height: '100vh',
          overflow: 'auto',
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
            <span style={{ color: '#0074CC' }}>{author}</span>
            <span style={{ color: '#838C95' }}> {formatDate(createdAt).slice(0, 10)}</span>
          </div>
          {tags.length > 0 ? (
            <div className="Tags" style={{ margin: '10px 10px' }}>
              {tags.map((tag, idx) => (
                <Tag color={TagColor[TagColor.length % idx]}>{tag}</Tag>
              ))}
            </div>
          ) : (
            <p />
          )}
          <h6 style={{ margin: '5px' }}>{usageCounts} 명이 이 코스를 방문했어요!</h6>
          <h6
            style={{ margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <MuiRating rate={rating} />{' '}
            <span style={{ marginLeft: '5px' }}>
              {rating} 점({rateNum}명이 평가했어요)
            </span>
          </h6>
          <div style={{ margin: '30px 20px', height: '100%' }}>
            <p>{description}</p>
          </div>

          <div className="site-card-wrapper">
            <div
              className="info"
              style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
            >
              <p>
                <strong>예상 소요 시간</strong> :{' '}
                {expectedTime >= 60
                  ? `${(expectedTime / 60).toFixed(0)}시간 ${expectedTime % 60}`
                  : expectedTime}
                분
              </p>
              <p>
                <strong>총 거리</strong> : {distance} km
              </p>
            </div>
          </div>
          <Button type="primary" onClick={onPlay}>
            네이버지도앱에 경로표시
          </Button>
          <Divider orientation="left" style={{ margin: 0 }}>
            <h3>리뷰</h3>
          </Divider>
          <ReviewPost courseId={id} courseAuthor={author} setChange={setChangeInside} />
          <div style={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
            <Select placeholder="필터 선택" onChange={handleChange} style={{ width: '120px' }}>
              {ReviewFilters.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <List style={{ height: '35vh' }}>
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
