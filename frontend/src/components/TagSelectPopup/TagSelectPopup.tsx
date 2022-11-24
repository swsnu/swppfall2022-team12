import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../store';

export default function TagSelectPopup() {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {

  }, []);

  return (
    <div id='tag-select-popup'>
      <p>아래 태그들 중 취향에 맞는 태그들을 선택해주세요!</p>
      <div id='tag-list'>
        tags
      </div>
    </div>
  )
}