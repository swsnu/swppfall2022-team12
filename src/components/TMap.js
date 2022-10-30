import React, { useEffect, useState } from 'react';
import axios from "axios";
import { dummyData } from "./dummyData";

const { Tmapv3 } = window;

export default function TMap() {
  const [tMap, setTMap] = useState();

  const resultMarkerArr = [];
  //경로그림정보
  let resultInfoArr = [];

  const initTMap = () => {
    const map = new Tmapv3.Map('TMapApp', {
      center: new Tmapv3.LatLng(37.405278291509404, 127.12074279785197),
      width: '100%',
      height: '100%',
      zoom: 14,
      zoomControl : true,
      scrollwheel : true
    });
    // 출발
    const marker_s = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.402688, 127.103259),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker_s);
    // 도착
    const marker_e = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.414382, 127.142571),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker_e);

    // 3. 경유지 심볼 찍기
    const marker1 = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.399569, 127.103790),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_1.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker1);

    const marker2 = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.402748, 127.108913),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_2.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker2);

    const marker3 = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.397153, 127.113403),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_3.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker3);

    const marker4 = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.410135, 127.121210),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_4.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker4);

    const marker5 = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.399400, 127.123296),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_5.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker5);

    const marker6 = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.406327, 127.130933),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_6.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker6);

    const marker7 = new Tmapv3.Marker({
      position : new Tmapv3.LatLng(37.413227, 127.127337),
      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_7.png",
      iconSize : new Tmapv3.Size(24, 38),
      map:map
    });
    resultMarkerArr.push(marker7);

    const headers = {
      'appKey': process.env.REACT_APP_TMAP_API_KEY,
      'Content-Type': 'application/json',
    };
    axios.post("https://apis.openapi.sk.com/tmap/routes/routeSequential30?version=1&format=json", dummyData, { headers })
      .then(response => {
        const resultData = response.data.properties;
        const resultFeatures = response.data.features;
        // console.log(resultData);
        // console.log(resultFeatures);
        const msg = `총 거리 : ${(resultData.totalDistance/1000).toFixed(1)} km, 총 시간 : ${(resultData.totalTime/60).toFixed(0)} 분, 총 요금 : ${resultData.totalFare} 원`
        console.log(msg);

        //기존  라인 초기화
        if(resultInfoArr.length > 0){
          for(let i in resultInfoArr){
            resultInfoArr[i].setMap(null);
          }
          resultInfoArr = [];
        }
        for(let i in resultFeatures) {
          const geometry = resultFeatures[i].geometry;
          const properties = resultFeatures[i].properties;

          const drawInfoArr = [];

          if(geometry.type === "LineString") {
            for(let j in geometry.coordinates){
              // 경로들의 결과값(구간)들을 포인트 객체로 변환
              const latlng = new Tmapv3.Point(geometry.coordinates[j][0], geometry.coordinates[j][1]);
              // 포인트 객체를 받아 좌표값으로 변환
              const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlng);
              // 포인트객체의 정보로 좌표값 변환 객체로 저장
              const convertChange = new Tmapv3.LatLng(convertPoint._lat, convertPoint._lng);

              drawInfoArr.push(convertChange);
            }
            const polyline_ = new Tmapv3.Polyline({
              path : drawInfoArr,
              strokeColor : "#FF0000",
              strokeWeight: 6,
              map : map
            });
            resultInfoArr.push(polyline_);
          }
          else {
            let markerImg = "";
            let size = "";			//아이콘 크기 설정합니다.

            if(properties.pointType === "S"){	//출발지 마커
              markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
              size = new Tmapv3.Size(24, 38);
            } else if(properties.pointType === "E"){	//도착지 마커
              markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
              size = new Tmapv3.Size(24, 38);
            } else{	//각 포인트 마커
              markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
              size = new Tmapv3.Size(8, 8);
            }

            // 경로들의 결과값들을 포인트 객체로 변환
            const latlon = new Tmapv3.Point(geometry.coordinates[0], geometry.coordinates[1]);
            // 포인트 객체를 받아 좌표값으로 다시 변환
            const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlon);

            const marker_p = new Tmapv3.Marker({
              position: new Tmapv3.LatLng(convertPoint._lat, convertPoint._lng),
              icon : markerImg,
              iconSize : size,
              map: map
            });
            resultMarkerArr.push(marker_p);
          }
        }
      })
    return map;
  }

  useEffect(() => {
    setTMap(initTMap());
  }, [])

  useEffect(() => {
    if (tMap === null) {
      return;
    }
    const script = document.createElement('script');
    script.innerHTML = tMap;
    script.async = true;
    document.head.appendChild(script);
  }, []);

    return (
      <>
        <h1>Map</h1>
        <div
          id='TMapApp'
          style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
          }}
      />
      </>
    )
}
