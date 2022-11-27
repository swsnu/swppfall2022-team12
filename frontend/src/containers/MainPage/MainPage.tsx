import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Header from '../../components/Header/Header';
import SearchBox from '../../components/SearchBox/SearchBox';
import TagSelectPopup from '../../components/TagSelectPopup/TagSelectPopup';
import { selectTag } from '../../store/slices/tag';
import user, { selectUser } from '../../store/slices/user';

function MainPage() {
  const navigate = useNavigate();
  const userState = useSelector(selectUser);
  const tagState = useSelector(selectTag);

  useEffect(() => {
    localStorage.removeItem('CATEGORY_KEY');
    localStorage.removeItem('SEARCH_KEY');
    localStorage.removeItem('FILTER');
  }, []);

  const onClickCreateCourse = () => {
    navigate('/course-create/search');
  };

  const toOpenPopup = tagState.selectedTags.length === 0;

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
      <TagSelectPopup toOpen={toOpenPopup} />
    </div>
  );
}

export default MainPage;
