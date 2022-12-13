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
        search_keyword: localStorage.getItem('SEARCH_KEY') ?? null,
        filter: localStorage.getItem('FILTER') ?? null,
        tags: null,
      };
      dispatch(fetchCourses(params));
    };
    init();
  }, []);

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
      <Header />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SearchBox searchKey={localStorage.getItem('SEARCH_KEY')} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '60vw',
          marginTop: '20px',
        }}
      >
        <h3>드라이브 코스 목록</h3>
        <ListFilter />
      </div>
      <div className="course-list">
        {courseState.courses.map((course) => {
          // eslint-disable-next-line
          const { id, author, title, description, created_at, rate, u_counts, e_time, distance } = course;

          return (
            <CourseListElement
              key={`course${id}`}
              id={id}
              author={author}
              title={title}
              description={description}
              createdAt={created_at}
              rate={rate}
              usageCounts={u_counts}
              expectedTime={e_time}
              distance={distance}
              showDetail={() => clickTitle(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
