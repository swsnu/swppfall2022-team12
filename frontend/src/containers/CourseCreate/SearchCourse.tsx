import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import KakaoMap from '../../components/Map/KakaoMap';
import SearchBar from '../../components/SearchBar/SearchBar';
import { AppDispatch } from '../../store';
import { fetchPathFromTMap, selectCourse } from '../../store/slices/course';

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

export default function SearchCourse() {
  const [map, setMap] = useState<kakao.maps.Map>();
  const [searchMarkers, setSearchMarkers] = useState<MarkerProps[]>([]);
  const [previewMarkers, setPreviewMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);
  const [info, setInfo] = useState<MarkerProps | null>(null);
  const [selected, setSelected] = useState<MarkerProps[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
  const [resultData, setResultData] = useState<DataProps | null>(null);
  const [resultFeatures, setResultFeatures] = useState<FeatureProps[]>([]);
  const [mapBound, setMapBound] = useState<kakao.maps.LatLngBounds>();

  const dispatch = useDispatch<AppDispatch>();
  const courseState = useSelector(selectCourse);
  const navigate = useNavigate();

  const searchPlaces = (keyword: string) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    if (keyword.length) {
      ps.keywordSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds();
          const markerArr: MarkerProps[] = [];

          data.forEach((item, i) => {
            markerArr.push({
              position: {
                lat: Number(data[i].y),
                lng: Number(data[i].x),
              },
              content: data[i].place_name,
            });
            bounds.extend(new kakao.maps.LatLng(Number(data[i].y), Number(data[i].x)));
          });
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
          // 포인트객체의 정보로 좌표값 변환 객체로 저장
          const convertChange = { lat: convertPoint._lat, lng: convertPoint._lng };

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
    setMapBound(bounds);
  };

  const addLocation = (marker: MarkerProps) => {
    setSelected([...selected, marker]);
  };

  const storeCourse = () => {
    if (selected.length) {
      navigate('/course-create/post', { state: { selected, path, resultData, mapBound } });
    } else {
      alert('경로를 작성해주세요');
    }
  };

  useEffect(() => {
    if (!map) return;
    if (preview) {
      if (selected.length < 3) {
        alert('장소를 적어도 3개 이상 선택해주세요');
        setPreview(false);
      }
      dispatch(fetchPathFromTMap(selected));
    }
  }, [preview]);

  useEffect(() => {
    setResultData(courseState.tMapCourse.tMapData);
    setResultFeatures(courseState.tMapCourse.tMapFeatures);
  }, [courseState]);

  useEffect(() => {
    if (resultData && resultFeatures) {
      processData();
    }
  }, [resultFeatures, resultData]);

  return (
    <>
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
        <button style={{ backgroundColor: 'white' }} onClick={storeCourse}>
          <h3>경로 완성</h3>
        </button>
      </div>
      <div className="Container" style={{ display: 'flex', position: 'fixed' }}>
        <SearchBar
          markers={searchMarkers}
          selected={selected}
          searchPlaces={searchPlaces}
          setInfo={setInfo}
          addLocation={addLocation}
        />
        <KakaoMap
          setMap={setMap}
          path={path}
          searchMarkers={searchMarkers}
          previewMarkers={previewMarkers}
          info={info}
          setInfo={setInfo}
          addLocation={addLocation}
          preview={preview}
        />
      </div>
    </>
  );
}
