/* global kakao */

import React, { useEffect, useState } from 'react';
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import { useDispatch, useSelector } from 'react-redux';

import {
  PositionProps,
  MarkerProps,
  DataProps,
  FeatureProps,
} from '../../containers/CourseCreate/CourseCreate';
import { AppDispatch } from '../../store';
import { fetchPathFromTMap, selectCourse } from '../../store/slices/course';
import poisData from '../poisData.json';

const { Tmapv3 } = window as any;

type MapProps = {
  map: kakao.maps.Map | undefined;
  setMap: (map: kakao.maps.Map) => void;
  // path: PositionProps[];
  markers: MarkerProps[];
  setMarkers: (marker: MarkerProps[]) => void;
  info: MarkerProps | null;
  setInfo: (marker: MarkerProps | null) => void;
  addLocation: (marker: MarkerProps) => void;
  preview: boolean;
};

function KakaoMap({
  map,
  setMap,
  markers,
  setMarkers,
  info,
  setInfo,
  addLocation,
  preview,
}: MapProps) {
  // const [map, setMap] = useState<kakao.maps.Map>();
  // const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const [routeMarkers, setRouteMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);
  const [resultData, setResultData] = useState<DataProps | null>();
  const [resultFeatures, setResultFeatures] = useState<FeatureProps[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const courseState = useSelector(selectCourse);

  const processData = () => {
    const drawInfoArr = [];
    const resultMarkerArr = [];
    const bounds = new kakao.maps.LatLngBounds();
    let viaPoint = 1;

    for (const i in resultFeatures) {
      const { geometry } = resultFeatures[i];
      const { properties } = resultFeatures[i];

      if (geometry.type === 'LineString') {
        for (const j in geometry.coordinates) {
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
      } else {
        let markerImg = '';

        if (properties.pointType === 'S') {
          // 출발지 마커
          markerImg = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
        } else if (properties.pointType === 'E') {
          // 도착지 마커
          markerImg = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
        } else {
          // 각 포인트 마커
          markerImg = `http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${viaPoint}.png`;
          viaPoint += 1;
        }

        // 경로들의 결과값들을 포인트 객체로 변환
        const latlon = new Tmapv3.Point(geometry.coordinates[0], geometry.coordinates[1]);
        // 포인트 객체를 받아 좌표값으로 다시 변환
        const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlon);

        resultMarkerArr.push({
          position: {
            lat: Number(convertPoint._lat),
            lng: Number(convertPoint._lng),
          },
          content: properties.viaPointName,
          image: markerImg,
        });
        bounds.extend(new kakao.maps.LatLng(Number(convertPoint._lat), Number(convertPoint._lng)));
      }
    }
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map?.setBounds(bounds);
    setPath(drawInfoArr);
    setRouteMarkers(resultMarkerArr);
    // setMarkers(resultMarkerArr);
  };

  useEffect(() => {
    if (!map) return;
    console.log(preview);
    if (preview) {
      setResultData(poisData.properties);
      setResultFeatures(poisData.features);
    }
  }, [preview, map]);

  useEffect(() => {
    if (resultData && resultFeatures) {
      processData();
    }
  }, [resultFeatures, resultData]);

  return (
    <div>
      {preview ? (
        <Map // 지도를 표시할 Container
          center={{
            // 지도의 중심좌표
            lat: 37.405278291509404,
            lng: 127.12074279785197,
          }}
          style={{
            // 지도의 크기
            width: '100%',
            height: '100%',
            right: '0px',
            position: 'fixed',
          }}
          level={3} // 지도의 확대 레벨
          onCreate={setMap}
        >
          <Polyline
            path={[path]}
            strokeWeight={5} // 선의 두께 입니다
            strokeColor="red" // 선의 색깔입니다
            strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle="solid" // 선의 스타일입니다
          />
          {routeMarkers.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              image={{
                src: marker.image ?? '',
                size: {
                  width: 24,
                  height: 38,
                },
              }}
              onMouseOver={() => setInfo(marker)}
              onMouseOut={() => setInfo(null)}
            >
              {info && info.content === marker.content && (
                <div style={{ color: '#000' }}>{marker.content.substring(4)}</div>
              )}
            </MapMarker>
          ))}
        </Map>
      ) : (
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
      )}
    </div>
  );
}

export default React.memo(KakaoMap);
