// import { Button } from '@mui/material';
import { Card, Badge } from 'antd';
import React, { useCallback, useMemo } from 'react';

import MuiRating from '../MuiRate/MuiRating';
import { formatDate } from '../ReviewElement/ReviewElement';

export interface CourseProps {
  id: number;
  author: string;
  title: string;
  description: string;
  rate: number;
  createdAt: string;
  usageCounts: number;
  expectedTime: number;
  distance: number;
  showDetail: () => void;
}

enum Limit {
  MAXIMUM_SUMMARY_TITLE_LENGTH = 50,
  MAXIMUM_SUMMARY_CONTENT_LENGTH = 100,
}

const useQuestionSummary = (pureText: string, limitLength: Limit) => {
  return useMemo(() => {
    return pureText.length > limitLength ? `${pureText.substring(0, limitLength)}...` : pureText;
  }, [pureText]);
};

export default function CourseListElement({
  id,
  author,
  title,
  description,
  rate,
  createdAt,
  usageCounts,
  expectedTime,
  distance,
  showDetail,
}: CourseProps) {
  const summaryTitle = useQuestionSummary(title, Limit.MAXIMUM_SUMMARY_TITLE_LENGTH);
  const summaryDescription = useQuestionSummary(description, Limit.MAXIMUM_SUMMARY_CONTENT_LENGTH);

  const Title = useCallback(
    () => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>{id}</span>
          <h4 style={{ margin: 0 }}>{summaryTitle}</h4>
        </div>
        <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MuiRating rate={rate} />
          <span>{rate}</span>
        </div>
      </div>
    ),
    [],
  );

  return (
    <Card
      id="course-list-element"
      hoverable
      title={<Title />}
      style={{ width: '60vw', marginBottom: '20px' }}
      bodyStyle={{ padding: '15px 24px' }}
      onClick={showDetail}
    >
      <div className="site-card-wrapper" style={{ textAlign: 'left' }}>
        <span style={{ color: '#0074CC' }}>{author}</span>
        <span style={{ color: '#838C95' }}> {formatDate(createdAt).slice(0, 10)}</span>
        <div
          className="info"
          style={{ display: 'flex', gap: '10px', textAlign: 'left', marginTop: '10px' }}
        >
          <span>
            <strong>예상 소요 시간</strong> :{' '}
            {expectedTime >= 60
              ? `${(expectedTime / 60).toFixed(0)}시간 ${expectedTime % 60}`
              : expectedTime}
            분
          </span>
          <span>
            <strong>총 거리</strong> : {distance} km
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <strong>이용 횟수</strong>{' '}
            <Badge
              className="site-badge-count-109"
              count={usageCounts}
              showZero
              style={{ backgroundColor: '#52C41A' }}
            />
          </span>
        </div>
        <p>{summaryDescription}</p>
      </div>
    </Card>
  );
}
