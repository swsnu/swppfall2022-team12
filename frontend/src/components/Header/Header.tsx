import { Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

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
    await axios
      .get('/api/user/logout/', {
        headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` },
      })
      .then(() => {
        window.sessionStorage.clear();
        navigate('/main');
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
        navigate('/main');
      });
  };

  const onClickCategory = async (category: string) => {
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
    <div className="header" style={{ width: '90%', marginBottom: '30px' }}>
      <div style={{ height: '30px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div role="button" tabIndex={0} onClick={onClickLogo}>
          <Logo />
        </div>
        {isLogin() ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>{window.sessionStorage.getItem('username')}???, ???????????????!</div>
            <Button onClick={onClickLogout}>????????????</Button>
          </div>
        ) : (
          <Button onClick={onClickLogin}>?????????</Button>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center' }}>
        <Button
          variant="outlined"
          style={{ borderWidth: '2px' }}
          onClick={() => onClickCategory('drive')}
        >
          ???????????? ????????????
        </Button>
        <Button variant="outlined" style={{ borderWidth: '2px' }} onClick={onClickCreateCourse}>
          ????????? ?????? ?????????
        </Button>
      </div>
    </div>
  );
}
