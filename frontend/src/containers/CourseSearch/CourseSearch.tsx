import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { MarkerProps } from '../../components/Map/KakaoMap';
import SearchMap from '../../components/SearchMap';
import styles from './CourseSearch.module.scss';

export default function CourseSearch() {
  // 입력 폼 변화 감지하여 입력 값 관리
  const [value, setValue] = useState<string>('');
  // 제출한 검색어 관리
  // const [keyword, setKeyword] = useState('');
  const [map, setMap] = useState<kakao.maps.Map>();
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [info, setInfo] = useState<MarkerProps | null>();
  const [selected, setSelected] = useState<MarkerProps[]>([]);
  const [preview, setPreview] = useState<boolean>(false);

  const searchPlaces = (keyword: string) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    if (keyword.length) {
      ps.keywordSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds();
          const markerArr = [];

          for (let i = 0; i < data.length; i += 1) {
            markerArr.push({
              position: {
                lat: Number(data[i].y),
                lng: Number(data[i].x),
              },
              content: data[i].place_name,
            });
            bounds.extend(new kakao.maps.LatLng(Number(data[i].y), Number(data[i].x)));
          }
          setMarkers(markerArr);

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.');
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert('검색 결과 중 오류가 발생했습니다.');
        }
      });
    }
  };

  const addLocation = (marker: MarkerProps) => {
    selected.push(marker);
    setSelected(selected);
  };

  const valueChecker = () => {
    if (value === '') {
      alert('검색어를 입력해주세요.');
      return false;
    }
  };

  const submitKeyword = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (valueChecker()) {
      return;
    }
    searchPlaces(value);
    // setKeyword(value);
    // setValue("");
  };

  return (
    <div className="Container" style={{ display: 'flex', position: 'fixed' }}>
      {/* Buttons */}
      <div
        className="buttons"
        style={{
          zIndex: 1,
          position: 'fixed',
          right: '10px',
          margin: '10px',
        }}
      >
        {preview ? (
          <button
            style={{ backgroundColor: 'white', marginRight: '10px' }}
            onClick={() => setPreview(false)}
          >
            <h3>경로 만들기</h3>
          </button>
        ) : (
          <button
            style={{ backgroundColor: 'white', marginRight: '10px' }}
            onClick={() => setPreview(true)}
          >
            <h3>경로 미리보기</h3>
          </button>
        )}

        <button style={{ backgroundColor: 'white' }}>
          <h3>경로 완성</h3>
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="SearchBar"
        style={{ width: '390px', zIndex: 1, backgroundColor: 'white', height: '100vh' }}
      >
        <h1>Search!</h1>
        {/* Keyword Input */}
        <form onSubmit={submitKeyword}>
          <input
            placeholder="검색어를 입력해주세요"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button>Search</button>
        </form>
        {/* Search Result List */}
        <div className="rst_wrap">
          <div className="rst mCustomScrollbar" style={{ overflow: 'auto', height: '100vh' }}>
            <h2>Route</h2>
            <div>
              <input className={styles.Input} placeholder="출발" />
            </div>
            <div>
              <input placeholder="도착" />
            </div>
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
                  style={{ padding: '18px 20px 20px' }}
                  onMouseEnter={() => setInfo(marker)}
                  onMouseLeave={() => setInfo(null)}
                >
                  {marker.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
      </div>

      {/* Display Map */}
      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: '100%',
          height: '100%',
          right: '0px',
          position: 'fixed',
        }}
        level={3}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onMouseOver={() => setInfo(marker)}
            onMouseOut={() => setInfo(null)}
            onClick={() => addLocation(marker)}
          >
            {info && info?.content === marker.content && (
              <div style={{ color: '#000' }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>
      {/* <SearchMap keyword={keyword} /> */}
    </div>
  );
}
