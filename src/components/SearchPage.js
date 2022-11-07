import React, { useState } from 'react';

import SearchMap from './SearchMap';

export default function SearchPage() {
  // 입력 폼 변화 감지하여 입력 값 관리
  const [value, setValue] = useState('');
  // 제출한 검색어 관리
  const [keyword, setKeyword] = useState('');

  // 검색어를 입력하지 않고 검색 버튼을 눌렀을 경우
  const valueChecker = () => {
    if (value === '') {
      alert('검색어를 입력해주세요.');
      return false;
    }
  };

  // 입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
  const valueChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  // 제출한 검색어 state에 담아주는 함수
  const submitKeyword = (e) => {
    e.preventDefault();
    if (valueChecker()) {
      return;
    }
    setKeyword(value);
    // setValue("");
  };

  return (
    <>
      <h1>Search!</h1>
      <form onSubmit={submitKeyword}>
        <input placeholder="검색어를 입력해주세요" value={value} onChange={valueChange} />
        <button>Search</button>
      </form>
      <SearchMap keyword={keyword} />
    </>
  );
}
