import { Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import Logo from '../../img/Logo';
import { AppDispatch } from '../../store';
import { FetchCoursesParams, fetchCourses } from '../../store/slices/course';
import isLogin from '../../utils/isLogin';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onClickLogo = () => {
    navigate('/main');
  };

  const onClickLogin = () => {
    navigate('/login');
  };

  const onClickLogout = async () => {
    if (window.sessionStorage.getItem('username') !== null) {
      await axios
        .get('/user/logout/', {
          headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` },
        })
        .then((response) => {
          window.sessionStorage.clear();
          navigate('/main');
        })
        .catch((error) => {
          alert(error.response.data.detail);
          navigate('/main');
        });
    }
  };

  const onClickCategory = async (category: string) => {
    // const prior = localStorage.getItem('CATEGORY_KEY');
    // if (prior !== category)
    localStorage.setItem('CATEGORY_KEY', category);
    localStorage.removeItem('SEARCH_KEY');
    localStorage.removeItem('FILTER');

    const params: FetchCoursesParams = {
      page: 1,
      category: localStorage.getItem('CATEGORY_KEY')!,
      search_keyword: null,
      filter: null,
      tags: null,
    };

    await dispatch(fetchCourses(params));
    navigate('/courses');
  };

  const onClickCreateCourse = () => {
    navigate('/course-create/search');
  };

  return (
    <div className="header" style={{ width: '90%' }}>
      <div style={{ height: '30px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div role="button" tabIndex={0} onClick={onClickLogo}>
          <Logo />
        </div>
        {/* <button onClick={() => onClickCategory('bike')}>바이크</button>
        <button onClick={() => onClickCategory('cycle')}>자전거</button>
        <button onClick={() => onClickCategory('run')}>런닝</button> */}
        {isLogin() ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>{window.sessionStorage.getItem('username')}님, 환영합니다!</div>
            <Button onClick={onClickLogout}>로그아웃</Button>
          </div>
        ) : (
          <Button onClick={onClickLogin}>로그인</Button>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center' }}>
        <Button variant="outlined" onClick={() => onClickCategory('drive')}>
          드라이브 전체보기
        </Button>
        <Button variant="outlined" onClick={onClickCreateCourse}>
          나만의 코스 만들기
        </Button>
      </div>
    </div>
  );
}
