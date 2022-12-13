import { Button, Card, CardContent, Typography } from '@mui/material';
import { Badge } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Header from '../../components/Header/Header';
import MuiRating from '../../components/MuiRate/MuiRating';
import SearchBox from '../../components/SearchBox/SearchBox';
import TagSelectPopup from '../../components/TagSelectPopup/TagSelectPopup';
import { AppDispatch } from '../../store';
import { CourseType, fetchRecommendedCourse, selectCourse } from '../../store/slices/course';
import isLogin from '../../utils/isLogin';

function MainPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const courseState = useSelector(selectCourse);

  const [tagIds, setTagIds] = useState<string[]>(
    JSON.parse(window.sessionStorage.getItem('tags') ?? '[]'),
  );
  const [toOpenPopup, setToOpenPopup] = useState<boolean>(!window.sessionStorage.getItem('tags'));

  useEffect(() => {
    localStorage.removeItem('CATEGORY_KEY');
    localStorage.removeItem('SEARCH_KEY');
    localStorage.removeItem('FILTER');

    dispatch(fetchRecommendedCourse());
  }, []);

  const onClickCourseDetail = (courseId: CourseType['id']) => {
    navigate(`/course/${courseId}`);
  };

  useEffect(() => {
    setTagIds(JSON.parse(window.sessionStorage.getItem('tags') ?? '[]'));
    dispatch(fetchRecommendedCourse());
  }, [toOpenPopup]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Header />
      <div style={{ height: '20px' }}> </div>
      <SearchBox searchKey={localStorage.getItem('SEARCH_KEY') ?? ''} />
      <div style={{ height: '20px' }}> </div>
      {isLogin() ? (
        <>
          <TagSelectPopup toOpen={toOpenPopup} openHandler={setToOpenPopup} />
          <div>
            <h2>{window.sessionStorage.getItem('username')}님을 위한 맞춤 코스</h2>
            <div>
              {tagIds.length === 0 && <span>아직 선택한 태그가 없어요. 태그를 골라주세요!</span>}
              <Button onClick={() => setToOpenPopup(true)}>태그 선택</Button>
            </div>
            <div>
              {courseState.recommendedCourses.map((set) => {
                const tagContent = set.tag;
                const coursesData = set.courses;
                if (coursesData.length === 0)
                  return <div key={set.tag} style={{ height: '100%' }} />;
                return (
                  <div
                    key={set.tag}
                    style={{
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      margin: '20px',
                    }}
                  >
                    <h3>{tagContent} 코스 추천</h3>
                    <div
                      style={{
                        display: 'flex',
                        overflowX: 'auto',
                      }}
                    >
                      {coursesData.map((course) => {
                        return (
                          <div
                            key={`recommended-course-${course.id}`}
                            style={{
                              width: '275px',
                              marginRight: '20px',
                            }}
                          >
                            <Card
                              variant="outlined"
                              sx={{
                                minWidth: '100%',
                                borderRadius: '8px',
                                ':hover': {
                                  boxShadow: '0 0 11px rgba(33,33,33,.2)',
                                },
                              }}
                            >
                              <CardContent
                                style={{
                                  height: '130px',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography variant="subtitle1">{course.title}</Typography>
                                <Typography
                                  mt={2}
                                  mb={2}
                                  variant="body1"
                                  style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}
                                >
                                  이용 횟수{' '}
                                  <Badge
                                    className="site-badge-count-109"
                                    count={course.u_counts}
                                    showZero
                                    style={{ backgroundColor: '#52C41A' }}
                                  />
                                </Typography>
                                <MuiRating rate={course.rate} />
                              </CardContent>
                              <Button
                                style={{ marginBottom: '10px' }}
                                onClick={() => onClickCourseDetail(course.id)}
                              >
                                코스 보기
                              </Button>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h3>맞춤형 코스 추천을 보고 싶다면 로그인하세요!</h3>
        </div>
      )}
    </div>
  );
}

export default MainPage;
