import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Header from '../../components/Header/Header';
import SearchBox from '../../components/SearchBox/SearchBox';

function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('CATEGORY_KEY');
    localStorage.removeItem('SEARCH_KEY');
    localStorage.removeItem('FILTER');
  }, []);

  const onClickCreateCourse = () => {
    navigate('search');
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
    </div>
  );
}

export default MainPage;
