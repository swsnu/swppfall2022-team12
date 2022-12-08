import React, { useState } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';

import { MarkerProps } from '../../containers/CourseCreate/SearchCourse'; // 스프라이트 이미지에서 마커간 간격

const MARKER_WIDTH = 20; // 기본, 클릭 마커의 너비
const MARKER_HEIGHT = 15; // 기본, 클릭 마커의 높이
const OFFSET_X = 12; // 기본, 클릭 마커의 기준 X좌표
const OFFSET_Y = MARKER_HEIGHT; // 기본, 클릭 마커의 기준 Y좌표
const OVER_MARKER_WIDTH = 40; // 오버 마커의 너비
const OVER_MARKER_HEIGHT = 42; // 오버 마커의 높이
const OVER_OFFSET_X = 13; // 오버 마커의 기준 X좌표
const OVER_OFFSET_Y = OVER_MARKER_HEIGHT; // 오버 마커의 기준 Y좌표
// const SPRITE_MARKER_URL =
//   'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png'; // 스프라이트 마커 이미지 URL
const SPRITE_MARKER_URL =
  'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/img_search2x.png';
const SPRITE_WIDTH = 126; // 스프라이트 이미지 너비
const SPRITE_HEIGHT = 146; // 스프라이트 이미지 높이
const SPRITE_GAP = 8;

// const MARKER_WIDTH = 33; // 기본, 클릭 마커의 너비
// const MARKER_HEIGHT = 36; // 기본, 클릭 마커의 높이
// const OFFSET_X = 12; // 기본, 클릭 마커의 기준 X좌표
// const OFFSET_Y = MARKER_HEIGHT; // 기본, 클릭 마커의 기준 Y좌표
// const OVER_MARKER_WIDTH = 40; // 오버 마커의 너비
// const OVER_MARKER_HEIGHT = 42; // 오버 마커의 높이
// const OVER_OFFSET_X = 13; // 오버 마커의 기준 X좌표
// const OVER_OFFSET_Y = OVER_MARKER_HEIGHT; // 오버 마커의 기준 Y좌표
// const SPRITE_MARKER_URL =
//   'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png'; // 스프라이트 마커 이미지 URL
// const SPRITE_WIDTH = 126; // 스프라이트 이미지 너비
// const SPRITE_HEIGHT = 146; // 스프라이트 이미지 높이
// const SPRITE_GAP = 10; // 스프라이트 이미지에서 마커간 간격

type EventMarkerProps = {
  marker: MarkerProps;
  index: number;
  onClick: () => void;
  isClicked: boolean;
  info: MarkerProps | null;
};

export default function EventMarker({ marker, index, onClick, isClicked, info }: EventMarkerProps) {
  const [isOver, setIsOver] = useState(false);
  const gapX = MARKER_WIDTH + SPRITE_GAP; // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
  const originY = (MARKER_HEIGHT + SPRITE_GAP) * index; // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
  const overOriginY = (OVER_MARKER_HEIGHT + SPRITE_GAP) * index; // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
  const normalOrigin = { x: 0, y: originY }; // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
  const clickOrigin = { x: gapX, y: originY }; // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
  const overOrigin = { x: gapX * 2, y: overOriginY }; // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표

  let spriteOrigin = isOver ? overOrigin : normalOrigin;

  if (isClicked) {
    spriteOrigin = clickOrigin;
  }

  return (
    <MapMarker
      position={marker.position} // 마커를 표시할 위치
      onClick={onClick}
      onMouseOver={() => setIsOver(true)}
      onMouseOut={() => setIsOver(false)}
      image={{
        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        size: {
          width: 33,
          height: 36,
        },
      }}
    >
      {info && info?.content === marker.content && (
        <div style={{ width: '100%', padding: '5px', color: '#000' }}>
          <div>Hello</div>
          {marker.content}
        </div>
      )}
    </MapMarker>
  );
}
