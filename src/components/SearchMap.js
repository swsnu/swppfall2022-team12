import React, {useEffect, useState} from "react";
import axios from "axios";

const { Tmapv3 } = window;

// 검색결과 목록의 자식 Element를 제거하는 함수
const removeAllChildNods = (el) => {
  while (el.hasChildNodes()) {
    el.lastChild &&
    el.removeChild (el.lastChild);
  }
}

function SearchTMap(keyword) {
  const [searchMap, setSearchMap] = useState();
  let markerArr = [];

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  const removeMarker = () => {
    for (let i = 0; i < markerArr.length; i++ ) {
      markerArr[i].setMap(null);
    }
    markerArr = [];
  }

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
    console.log("keyword:", keyword.keyword)

    // 2. POI 통합 검색 API 요청
    // 검색 버튼이 눌렸을 경우
    if (keyword.keyword !== "") {
      const params = {
        appKey: process.env.REACT_APP_TMAP_API_KEY2,
        searchKeyword: keyword.keyword,
        resCoordType: "EPSG3857",
        reqCoordType: "WGS84GEO",
        count: 10
      }
      axios.get("https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result", {params})
        .then(response => {
          const resultpoisData = response.data.searchPoiInfo.pois.poi;
          console.log(resultpoisData);
          let innerHtml = ""; // Search Results 결과값 노출을 위한 변수
          const positionBounds = new Tmapv3.LatLngBounds(); // 맵에 결과물 확인 하기 위한 LatLngBounds객체 생성

          for (let i in resultpoisData) {
            const noorLat = Number(resultpoisData[i].noorLat);
            const noorLon = Number(resultpoisData[i].noorLon);
            const name = resultpoisData[i].name;

            const pointCng = new Tmapv3.Point(noorLon, noorLat);
            const projectionCng = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(pointCng);

            const lat = projectionCng._lat;
            const lon = projectionCng._lng;

            const markerPosition = new Tmapv3.LatLng(lat, lon);
            const marker = new Tmapv3.Marker({
              position : markerPosition,
              icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + i + ".png",
              iconSize : new Tmapv3.Size(24, 38),
              title : name,
              map: map
            });

            innerHtml += "<li><img src='http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + i + ".png' style='vertical-align:middle;'/><span>"+name+"</span></li>";

            markerArr.push(marker);
            positionBounds.extend(markerPosition);	// LatLngBounds의 객체 확장
          }
          const el = document.getElementById('searchResult');
          el.innerHTML = innerHtml;
          map.panToBounds(positionBounds);	// 확장된 bounds의 중심으로 이동시키기
          map.zoomOut();
        })
    }
    return map;
  }

  useEffect(() => {
    setSearchMap(initTMap());
  }, [keyword])

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
      <div className="title"><strong>Search</strong> Results</div>
      <div className="rst_wrap">
        <div className="rst mCustomScrollbar">
          <ul id="searchResult" name="searchResult">
            <li>검색결과</li>
          </ul>
        </div>
      </div>
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

export default React.memo(SearchTMap);
