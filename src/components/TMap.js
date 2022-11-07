/* global kakao */

import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { dummyData } from "./dummyData";

const { Tmapv3 } = window;

export default function TMap() {
  const [map, setMap] = useState()
  const [resultData, setResultData] = useState();
  const [resultFeatures, setResultFeatures] = useState([]);
  const [path, setPath] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [info, setInfo] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'appKey': process.env.REACT_APP_TMAP_API_KEY,
          'Content-Type': 'application/json',
        };
        const response = await axios.post(
          "https://apis.openapi.sk.com/tmap/routes/routeSequential30?version=1&format=json",
          dummyData,
          { headers }
        )
        // console.log("resultData:", response.data.properties);
        // console.log("resultFeatures:", response.data.features);
        setResultData(response.data.properties);
        setResultFeatures(response.data.features);
      } catch(err) {
        console.log("Error >>", err);
      }
    }
    fetchData().then();
  }, [])

  useEffect(() => {
    if (resultData && resultFeatures) {
      console.log("Process")
      processData();
    }
  }, [resultData, resultFeatures])

  const processData = () => {
    const drawInfoArr = [];
    const resultMarkerArr = [];
    const bounds = new kakao.maps.LatLngBounds()
    let viaPoint = 1;

    for (let i in resultFeatures) {
      const geometry = resultFeatures[i].geometry;
      const properties = resultFeatures[i].properties;

      if (geometry.type === "LineString") {
        for (let j in geometry.coordinates) {
          // 경로들의 결과값(구간)들을 포인트 객체로 변환
          const latlng = new Tmapv3.Point(geometry.coordinates[j][0], geometry.coordinates[j][1]);
          // 포인트 객체를 받아 좌표값으로 변환
          const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlng);
          // console.log("convertPoint:", convertPoint);
          // 포인트객체의 정보로 좌표값 변환 객체로 저장
          const convertChange = { lat: convertPoint._lat, lng: convertPoint._lng };
          // console.log("convertChange:", convertChange);

          drawInfoArr.push(convertChange);
        }
      }
      else {
        let markerImg = "";
        let size = "";  //아이콘 크기 설정합니다.

        if (properties.pointType === "S") {	//출발지 마커
          markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
          size = new kakao.maps.Size(24, 38);
        } else if (properties.pointType === "E") {	//도착지 마커
          markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
          size = new kakao.maps.Size(24, 38);
        } else {	//각 포인트 마커
          markerImg = `http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${viaPoint}.png`;
          size = new kakao.maps.Size(8, 8);
          viaPoint += 1;
        }

        // 경로들의 결과값들을 포인트 객체로 변환
        const latlon = new Tmapv3.Point(geometry.coordinates[0], geometry.coordinates[1]);
        // 포인트 객체를 받아 좌표값으로 다시 변환
        const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlon);

        resultMarkerArr.push({
          position: {
            lat: convertPoint._lat,
            lng: convertPoint._lng,
          },
          content: properties.viaPointName,
          image: markerImg,
        })
        bounds.extend(new kakao.maps.LatLng(convertPoint._lat, convertPoint._lng))
      }
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      // map.setBounds(bounds)
    }
    console.log("InfoArr:", drawInfoArr)
    map.setBounds(bounds);
    setPath(drawInfoArr);
    setMarkers(resultMarkerArr);
  }

  return (
    <>
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 37.405278291509404,
          lng: 127.12074279785197,
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "450px",
        }}
        level={3} // 지도의 확대 레벨
        onCreate={setMap}
      >
      <Polyline
        path={[path]}
        strokeWeight={5} // 선의 두께 입니다
        strokeColor={"red"} // 선의 색깔입니다
        strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle={"solid"} // 선의 스타일입니다
      />
      {markers.map(marker => (
        <MapMarker
          key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          image={{
            src: marker.image,
            size: {
              width: 24,
              height: 38,
            },
          }}
          onMouseOver={() => setInfo(marker)}
          onMouseOut={() => setInfo(null)}
        >
          {info && info?.content === marker.content && (
            <div style={{color:"#000"}}>{marker.content.substring(4)}</div>
          )}
        </MapMarker>
      ))}
      </Map>
    </>
  )
}
