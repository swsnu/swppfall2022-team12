import { Button } from '@mui/material';
// eslint-disable-next-line
import React from 'react';
import MuiRating from '../MuiRate/MuiRating';

export interface CourseProps {
  id: number;
  title: string;
  description: string;
  rate: number;
  usageCounts: number;
  expectedTime: number;
  showDetail: () => void;
}

export default function CourseListElement(props: CourseProps) {
  const { id, title, description, rate, usageCounts, expectedTime, showDetail } = props;

  return (
    <div id="course-list-element">
      <div>
        <p>{id}</p>
        <Button variant="text" onClick={showDetail}>
          {title}
        </Button>
        <MuiRating rate={rate} />
        <span>{rate}</span>
      </div>
      <div>
        <span> played {usageCounts} time(s)</span>
        <span> expected time: {expectedTime} min</span>
      </div>

      <p>{description}</p>
    </div>
  );
}
