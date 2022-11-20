import React, { useState } from 'react';

import { MarkerProps } from '../../containers/CourseCreate/SearchCourse';
import styles from '../../containers/CourseCreate/SearchCourse.module.scss';

type SearchProps = {
  markers: MarkerProps[];
  selected: MarkerProps[];
  searchPlaces: (keyword: string) => void;
  setInfo: (marker: MarkerProps | null) => void;
  addLocation?: () => void;
};

export default function SearchBar({
  markers,
  selected,
  searchPlaces,
  setInfo,
  addLocation,
}: SearchProps) {
  const [keyword, setKeyword] = useState('');

  const valueChecker = () => {
    if (keyword === '') {
      return true;
    }
  };

  const submitKeyword = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (valueChecker()) {
      alert('검색어를 입력해주세요.');
    }
    searchPlaces(keyword);
  };

  return (
    <div
      className="SearchBar"
      style={{
        width: '390px',
        zIndex: 1,
        backgroundColor: 'white',
        // height: '100vh',
        // height: 'inherit',
        // position: 'relative',
      }}
    >
      <h1>Search!</h1>
      {/* Keyword Input */}
      <form onSubmit={submitKeyword}>
        <input
          placeholder="검색어를 입력해주세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button>검색</button>
      </form>

      {/* Selected Location List */}
      <div className="selection">
        <strong>Selected Locations</strong>
        {selected &&
          selected.map((location) => (
            <li
              key={`marker-${location.content}-${location.position.lat},${location.position.lng}`}
            >
              {location.content}
            </li>
          ))}
      </div>

      {/* Search Result List */}
      <div className="rst_wrap">
        <div className="rst mCustomScrollbar" style={{ overflow: 'auto', height: '100vh' }}>
          <h2>Route</h2>
          {/* <div> */}
          {/*  <input className={styles.Input} placeholder="출발" /> */}
          {/* </div> */}
          {/* <div> */}
          {/*  <input placeholder="도착" /> */}
          {/* </div> */}
          <div className="title">
            <strong>Search</strong> Results
          </div>
          <ul
            id="searchResult"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {markers.map((marker) => (
              <li
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                id={marker.content}
                style={{
                  padding: '18px 20px 20px',
                  outline: '1px solid blue',
                }}
                onMouseEnter={() => setInfo(marker)}
                onMouseLeave={() => setInfo(null)}
              >
                {marker.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
