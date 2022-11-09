import { Button } from '@mui/material';
// eslint-disable-next-line
import React from 'react';
import MuiRating from '../StarRate/MuiRating';

export interface CourseProps {
  id: number;
  title: string;
  description: string;
  grade: number;
  usageCounts: number;
  expectedTime: string;
  showDetail: () => void;
}

export default function CourseListElement(props: CourseProps) {
  const { id, title, description, grade, usageCounts, expectedTime, showDetail } = props;

  return (
    <div id="course-list-element">
      <div>
        <p>{id}</p>
        <Button variant="text" onClick={showDetail}>
          {title}
        </Button>
        <MuiRating rate={grade} />
        <span>{grade}</span>
      </div>
      <div>
        <span> played {usageCounts} times</span>
        <span> expected time: {expectedTime}</span>
      </div>

      <p>{description}</p>
    </div>
  );
}
