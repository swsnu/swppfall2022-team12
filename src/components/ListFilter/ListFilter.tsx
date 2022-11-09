import { InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch } from '../../store';
import { fetchCourses, FetchCoursesParams } from '../../store/slices/course';

export default function ListFilter() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const filterKey = localStorage.getItem('FILTER') ?? '-';

  const handleFilter = async (e: SelectChangeEvent) => {
    if (e.target.value === '-') {
      localStorage.removeItem('FILTER');
    } else {
      localStorage.setItem('FILTER', e.target.value as string);
    }
    const params: FetchCoursesParams = {
      page: 1,
      category: localStorage.getItem('CATEGORY_KEY') ?? 'drive',
      searchKeyword: localStorage.getItem('SEARCH_KEY') ?? null,
      filter: localStorage.getItem('FILTER') ?? null,
    };

    await dispatch(fetchCourses(params));
    navigate('/courses');
  };

  return (
    <FormControl sx={{ minWidth: 150 }} size="small">
      <InputLabel id="list-filter-label">Filter</InputLabel>
      <Select
        labelId="list-filter-label"
        id="list-filter-select"
        label="Filter"
        defaultValue={filterKey}
        onChange={handleFilter}
      >
        <MenuItem value="-" disabled>
          <em>정렬</em>
        </MenuItem>
        <MenuItem value="use">인기 순</MenuItem>
        <MenuItem value="time_asc">최근 순▼</MenuItem>
        <MenuItem value="time_desc">최근 순▲</MenuItem>
        <MenuItem value="distance_asc">거리 순▼</MenuItem>
        <MenuItem value="distance_desc">거리 순▲</MenuItem>
      </Select>
    </FormControl>
  );
}
