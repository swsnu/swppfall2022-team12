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
    <div className="main-search">
      <input
        placeholder="Search Courses"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        ref={inputFocus}
      />
      <button onClick={onClickSearch}>Search</button>
    </div>
  );
}
