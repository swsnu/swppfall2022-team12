import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import KakaoMap from '../../components/Map/KakaoMap';
import poisData from '../../components/poisData.json';
import SearchBar from '../../components/SearchBar/SearchBar';
import { AppDispatch } from '../../store';
import { fetchPathFromTMap, selectCourse } from '../../store/slices/course';
import styles from './CourseCreate.module.scss';
import SearchCourse from './SearchCourse';

const { Tmapv3 } = window as any;

export interface FeatureProps {
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: {
    index: string;
    viaPointId: string;
    viaPointName: string;
    arriveTime: string;
    completeTime: string;
    distance: string;
    deliveryTime: string;
    waitTime: string;
    pointType: string;
  };
}

export interface DataProps {
  totalDistance: string;
  totalTime: string;
  totalFare: string;
}

export interface PositionProps {
  lat: number;
  lng: number;
}

export interface MarkerProps {
  position: PositionProps;
  content: string;
  image?: string;
}

export default function CourseCreate() {
  const [map, setMap] = useState<kakao.maps.Map>();
  const [searchMarkers, setSearchMarkers] = useState<MarkerProps[]>([]);
  const [previewMarkers, setPreviewMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);
  const [info, setInfo] = useState<MarkerProps | null>(null);
  const [selected, setSelected] = useState<MarkerProps[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
  const [onSearch, setOnSearch] = useState<boolean>(true);
  const [resultData, setResultData] = useState<DataProps | null>();
  const [resultFeatures, setResultFeatures] = useState<FeatureProps[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const courseState = useSelector(selectCourse);

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
          setSearchMarkers(markerArr);
          setPreview(false);

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
    setPreviewMarkers(resultMarkerArr);
  };

  const addLocation = (marker: MarkerProps) => {
    selected.push(marker);
    setSelected(selected);
  };

  useEffect(() => {
    if (!map) return;
    if (preview) {
      dispatch(fetchPathFromTMap(selected));
    }
  }, [preview]);

  useEffect(() => {
    setResultData(courseState.tMapData);
    setResultFeatures(courseState.tMapFeatures);
    // setResultData(poisData.properties);
    // setResultFeatures(poisData.features);
  }, [courseState]);

  useEffect(() => {
    if (resultData && resultFeatures) {
      processData();
    }
  }, [resultFeatures, resultData]);

  return (
    <SearchCourse
      preview={preview}
      setPreview={setPreview}
      selected={selected}
      searchMarkers={searchMarkers}
      previewMarkers={previewMarkers}
      path={path}
      searchPlaces={searchPlaces}
      addLocation={addLocation}
      info={info}
      setInfo={setInfo}
      setMap={setMap}
    />
  );
}
