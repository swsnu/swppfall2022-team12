import SearchIcon from '@mui/icons-material/Search';
import { TextField, Input, InputAdornment, Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch } from '../../store';
import { FetchCoursesParams, fetchCourses } from '../../store/slices/course';

interface SearchProp {
  searchKey: string | null;
}

export default function SearchBox(prop: SearchProp) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const inputFocus = useRef<HTMLInputElement>(null);

  const { searchKey } = prop;
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    setSearchInput(searchKey ?? '');
  }, [searchKey]);

  const onClickSearch = async () => {
    if (searchInput === '' && inputFocus.current != null) {
      inputFocus.current.focus();
    } else {
      localStorage.setItem('SEARCH_KEY', searchInput);
      const params: FetchCoursesParams = {
        page: 1,
        category: localStorage.getItem('CATEGORY_KEY') ?? 'drive',
        search_keyword: localStorage.getItem('SEARCH_KEY') ?? null,
        filter: localStorage.getItem('FILTER') ?? null,
        tags: null,
      };

      await dispatch(fetchCourses(params));
      navigate('/courses');
    }
  };

  return (
    <div
      style={{
        height: '360px',
        width: '800px',
        borderRadius: '10px',
        backgroundImage: 'url(/search-bg.jpg)',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="main-search"
        style={{
          height: '20%',
          width: '70%',
          borderRadius: '50px',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <TextField
          label="어디로 가볼까요?"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          ref={inputFocus}
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          style={{ width: '70%' }}
        />
        <Button variant="outlined" onClick={onClickSearch}>
          로 떠나기
        </Button>
      </div>
    </div>
  );
}
