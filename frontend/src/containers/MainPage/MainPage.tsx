import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Header from '../../components/Header/Header';
import SearchBox from '../../components/SearchBox/SearchBox';
import TagSelectPopup from '../../components/TagSelectPopup/TagSelectPopup';
import { AppDispatch } from '../../store';
import course, { fetchRecommendedCourse, selectCourse } from '../../store/slices/course';
import tag, { selectTag } from '../../store/slices/tag';
import user, { selectUser } from '../../store/slices/user';

function MainPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userState = useSelector(selectUser);
  const tagState = useSelector(selectTag);
  const courseState = useSelector(selectCourse);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [toOpenPopup ,setToOpenPopup] = useState<boolean>(!!!window.sessionStorage.getItem('tags'));

  const convertTagsStringToArray = (tags: string | null) => {
    if (tags === null) return [];
    return tags.split(',');
  };

  useEffect(() => {
    // setTagIds(convertTagsStringToArray(window.sessionStorage.getItem('tags')));
    // console.log(tagIds, tagIds.length, toOpenPopup);
    localStorage.removeItem('CATEGORY_KEY');
    localStorage.removeItem('SEARCH_KEY');
    localStorage.removeItem('FILTER');

    dispatch(fetchRecommendedCourse());
  }, []);

  // useEffect(() => {
  //   setTagIds(convertTagsStringToArray(window.sessionStorage.getItem('tags')));
  // }, [window.sessionStorage]);

  const onClickCreateCourse = () => {
    navigate('/course-create/search');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2>Main Page</h2>
      <Header />
      <div style={{ height: '20px' }}> </div>
      <SearchBox searchKey={localStorage.getItem('SEARCH_KEY') ?? ''} />
      <div style={{ height: '20px' }}> </div>
      <Button variant="outlined" onClick={onClickCreateCourse}>
        Create New Course
      </Button>
      <TagSelectPopup toOpen={toOpenPopup} openHandler={setToOpenPopup}/>
      <div>
        <p>{window.sessionStorage.getItem('username')}님을 위한 맞춤 코스</p>
        <div>
          {tagIds.length === 0 && <span>아직 선택한 태그가 없어요. 태그를 골라주세요!</span>}
          <Button onClick={() => setToOpenPopup(true)}>태그 선택</Button>
        </div>
        <div>
          {courseState.recommendedCourses.map((set) => {
            const tagContent = set.tag;
            const coursesData = set.courses;
            if (coursesData.length === 0) return;
            return (
              <>
                <div>{tagContent}</div>
                {coursesData.map((course) => {
                  return (
                    <div>
                      {course.title}
                    </div>
                  );
                })}
              </>

            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
