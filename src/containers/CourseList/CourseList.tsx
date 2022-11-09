import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import CourseListElement from '../../components/CourseListElement/CourseListElement';
import Header from '../../components/Header/Header';
import ListFilter from '../../components/ListFilter/ListFilter';
import SearchBox from '../../components/SearchBox/SearchBox';
import { AppDispatch } from '../../store';
import {
  selectCourse,
  FetchCoursesParams,
  fetchCourses,
  fetchCourse,
} from '../../store/slices/course';

type CourseElemType = {
  id: number;
  title: string;
  description: string;
  category: string;
  grade: number;
  fCounts: number;
};

export default function CourseList() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const courseState = useSelector(selectCourse);

  useEffect(() => {
    const init = () => {
      const params: FetchCoursesParams = {
        page: 1,
        category: localStorage.getItem('CATEGORY_KEY') ?? 'drive',
        searchKeyword: localStorage.getItem('SEARCH_KEY') ?? null,
        filter: localStorage.getItem('FILTER') ?? null,
      };
      dispatch(fetchCourses(params));
    };
    init();
  }, []);

  const korCategory = (ctgry: string) => {
    if (ctgry === 'drive') return '드라이브';
    if (ctgry === 'bike') return '바이크 라이드';
    if (ctgry === 'cycle') return '자전거 라이드';
    if (ctgry === 'run') return '런닝/산책';
    if (ctgry === '') return '';
    return '';
  };

  const clickTitle = async (id: CourseElemType['id']) => {
    await dispatch(fetchCourse(id));
    navigate(`/course/${id}`);
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
      <h2>Courses List</h2>
      <Header />
      <h3>{korCategory(localStorage.getItem('CATEGORY_KEY') ?? 'drive')}</h3>
      <div className="course-list">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SearchBox searchKey={localStorage.getItem('SEARCH_KEY')} />
          <ListFilter />
        </div>
        {courseState.courses.map((course) => {
          // eslint-disable-next-line
          const { id, title, description, u_counts, e_time } = course;

          return (
            <CourseListElement
              key={`course${id}`}
              id={id}
              title={title}
              description={description}
              grade={4.5}
              usageCounts={u_counts}
              expectedTime={e_time}
              showDetail={() => clickTitle(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
