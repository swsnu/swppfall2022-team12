/* global kakao */

import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function SearchMap(keyword) {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!map) return
    const ps = new kakao.maps.services.Places();

    const { Keyword } = keyword;

    if (Keyword !== "") {
      ps.keywordSearch(Keyword, (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds();
          const markerArr = [];

          for (let i = 0; i < data.length; i += 1) {
            markerArr.push({
              position: {
                lat: data[i].y,
                lng: data[i].x,
              },
              content: data[i].place_name,
            });
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
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
  }, [map, keyword]);

  const addLocation = (marker) => {
    selected.push(marker);
    setSelected(selected);
  };

  return (
    <>
      <div style={{ width: '30%', float: 'right' }}>
        <div className="title">
          <strong>Search</strong> Results
        </div>
        <div className="rst_wrap">
          <div className="rst mCustomScrollbar">
            <ul id="searchResult" name="searchResult">
              {markers.map((marker) => (
                <li
                  key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                  onMouseEnter={() => setInfo(marker)}
                  onMouseLeave={() => setInfo(null)}
                >
                  {marker.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
        <button>경로 미리보기</button>
        <button>경로 완성</button>
      </div>
      <Map // 로드뷰를 표시할 Container
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: '70%',
          height: '100%',
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
    </>
  );
}
export default React.memo(SearchMap);
