/* global kakao */
import { Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

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
  selected?: boolean;
}

export default function CourseEditSearch() {
  const { id } = useParams();
  const [map, setMap] = useState<kakao.maps.Map>();
  const [searchMarkers, setSearchMarkers] = useState<MarkerProps[]>([]);
  const [previewMarkers, setPreviewMarkers] = useState<MarkerProps[]>([]);
  const [path, setPath] = useState<PositionProps[]>([]);
  const [info, setInfo] = useState<MarkerProps | null>(null);
  const [selected, setSelected] = useState<MarkerProps[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
  const [resultData, setResultData] = useState<DataProps | null>(null);
  const [resultFeatures, setResultFeatures] = useState<FeatureProps[]>([]);
  const [okayToPost] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const courseState = useSelector(selectCourse);
  const navigate = useNavigate();

  const searchPlaces = (keyword: string) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    if (keyword.length) {
      ps.keywordSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // ????????? ?????? ????????? ???????????? ?????? ????????? ?????????????????????
          // LatLngBounds ????????? ????????? ???????????????
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

          // ????????? ?????? ????????? ???????????? ?????? ????????? ??????????????????
          map.setBounds(bounds);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          toast.warning('?????? ????????? ???????????? ????????????.');
        } else if (status === kakao.maps.services.Status.ERROR) {
          toast.error('?????? ?????? ??? ????????? ??????????????????.');
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
          // ???????????? ?????????(??????)?????? ????????? ????????? ??????
          const latlng = new Tmapv3.Point(geometry.coordinates[j][0], geometry.coordinates[j][1]);
          // ????????? ????????? ?????? ??????????????? ??????
          const convertPoint = new Tmapv3.Projection.convertEPSG3857ToWGS84GEO(latlng);
          // ?????????????????? ????????? ????????? ?????? ????????? ??????
          const convertChange = { lat: convertPoint._lat, lng: convertPoint._lng };

          drawInfoArr.push(convertChange);
        }
      } else {
        let markerImg = '';

        if (properties.pointType === 'S') {
          // ????????? ??????
          markerImg = 'https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
        } else if (properties.pointType === 'E') {
          // ????????? ??????
          markerImg = 'https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
        } else {
          // ??? ????????? ??????
          markerImg = `https://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${viaPoint}.png`;
          viaPoint += 1;
        }

        // ???????????? ??????????????? ????????? ????????? ??????
        const latlon = new Tmapv3.Point(geometry.coordinates[0], geometry.coordinates[1]);
        // ????????? ????????? ?????? ??????????????? ?????? ??????
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
    // ????????? ?????? ????????? ???????????? ?????? ????????? ??????????????????
    map?.setBounds(bounds, 200, 0, 270, 500);
    setPath(drawInfoArr);
    setPreviewMarkers(resultMarkerArr);
  };

  const addLocation = (marker: MarkerProps) => {
    if (
      selected.find(
        (item) =>
          item.position.lat === marker.position.lat && item.position.lng === marker.position.lng,
      )
    ) {
      toast.warning('?????? ?????? ????????? ?????????????????????');
    } else {
      setSelected([...selected, marker]);
      const added = searchMarkers.map((item) => {
        if (item.content === marker.content) {
          return {
            ...marker,
            image: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png',
            selected: true,
          };
        }
        return item;
      });
      setSearchMarkers(added);
    }
  };

  const removeLocation = (marker: MarkerProps) => {
    const removedLocations = selected.filter(
      (item) =>
        item.position.lat !== marker.position.lat && item.position.lng !== marker.position.lng,
    );
    setSelected(removedLocations);
    const removed = searchMarkers.map((item) => {
      if (item.content === marker.content) {
        return {
          ...marker,
          selected: false,
        };
      }
      return item;
    });
    setSearchMarkers(removed);
  };

  const setMarkerImage = (markers: MarkerProps[]) => {
    const points = markers;
    const processedMarkers: MarkerProps[] = [];
    let count = 1;

    for (let i = 0; i < points.length; i += 1) {
      if (i === 0) {
        points[i].image = 'https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
      } else if (i === points.length - 1) {
        points[i].image = 'https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
      } else {
        points[i].image = `https://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${count}.png`;
        count += 1;
      }
      processedMarkers.push(points[i]);
    }
    setSelected(processedMarkers);
  };

  const handleDrag = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...selected];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelected(items);
  };

  const storeCourse = () => {
    if (!preview && !okayToPost) {
      toast.info('?????? ??????????????? ???????????????!');
      return;
    }
    if (selected.length) {
      setMarkerImage(selected);
      navigate(`/course/edit-post/${id}/`, { state: { selected, path, resultData } });
    } else {
      toast.warning('????????? ??????????????????');
    }
  };

  useEffect(() => {
    axios
      .get(`/api/course/${id}/`, {
        headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` },
      })
      .then((res) => {
        setPreviewMarkers(res.data.markers);
        setSelected(res.data.markers);
        setPath(res.data.path);
        setPreview(true);
        setResultData({
          totalDistance: res.data.distance,
          totalTime: res.data.e_time,
          totalFare: '0',
        });
      });
  }, []);

  useEffect(() => {
    if (!map) return;
    if (preview) {
      if (selected.length < 3) {
        toast.warning('????????? ????????? 3??? ?????? ??????????????????');
        setPreview(false);
        return;
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
          <Button
            style={{
              marginRight: 15,
              height: 50,
              boxShadow:
                'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
            }}
            size="large"
            onClick={() => setPreview(false)}
          >
            <h4 style={{ margin: 0 }}>?????? ??????</h4>
          </Button>
        ) : (
          <Button
            style={{
              marginRight: 15,
              height: 50,
              boxShadow:
                'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
            }}
            size="large"
            onClick={() => setPreview(true)}
          >
            <h4 style={{ margin: 0 }}>?????? ????????????</h4>
          </Button>
        )}
        <Button
          style={{
            height: 50,
            boxShadow:
              'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
          }}
          size="large"
          onClick={storeCourse}
        >
          <h4 style={{ margin: 0 }}>?????? ??????</h4>
        </Button>
      </div>
      <div className="Container" style={{ display: 'flex', position: 'fixed' }}>
        <SearchBar
          markers={searchMarkers}
          selected={selected}
          searchPlaces={searchPlaces}
          setInfo={setInfo}
          addLocation={addLocation}
          removeLocation={removeLocation}
          handleDrag={handleDrag}
          preview={preview}
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
