import React, {useEffect, useState} from "react";
import axios from "axios";

const { Tmapv3 } = window;

export default function SearchTMap(keyword, onClick) {
  const [searchMap, setSearchMap] = useState();

  const initTMap = () => {
    // 1. 지도 띄우기
    const map = new Tmapv3.Map('MapApp', {
      center: new Tmapv3.LatLng(37.405278291509404, 127.12074279785197),
      width: '70%',
      height: '100%',
      zoom: 17,
      zoomControl : true,
      scrollwheel : true
    });

    // 2. POI 통합 검색 API 요청
    // 검색 버튼이 눌렸을 경우
    if (onClick > 0) {
      const params = {
        appKey: process.env.REACT_APP_TMAP_API_KEY,
        searchKeyword: keyword,
        resCoordType: "EPSG3857",
        reqCoordType: "WGS84GEO",
        count: 10
      }
      axios.get("https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result", {params})
        .then(response => console.log(response.data))
    }
    return map;
  }

  useEffect(() => {
    setSearchMap(initTMap());
  }, [])

  useEffect(() => {
    if (searchMap === null) {
      return;
    }
    const script = document.createElement('script');
    script.innerHTML = initTMap();
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <>
      <div
        id='MapApp'
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
        }}
      />
    </>
  )
}
