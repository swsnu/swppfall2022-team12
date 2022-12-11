import { Input, Button } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const { TextArea } = Input;

interface ReviewPostProp {
  courseId: string | undefined;
  setChange: (argv: number) => void;
}

export default function ReviewPost(prop: ReviewPostProp) {
  const [content, setContent] = useState<string>('');
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const [rate, setRate] = useState<number>(5);
  const [courseId, setCourseId] = useState<number>(1);

  const post = () => {
    if (content.length === 0) {
      return false;
    }
    const data = {
      course: courseId,
      rate,
      content,
    };
    axios
      .post('/api/review/', data, {
        headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` },
      })
      .then(() => {
        /* eslint no-restricted-globals: ["off"] */
        prop.setChange(Math.random());
        setContent('');
        setRate(5);
        setClicked([false, false, false, false, false]);
        // test needed for reloading***
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        {clicked.map((currBoolean, idx) => {
          return (
            <FaStar
              key={`${currBoolean}-${Math.random()}`}
              data-testid="star"
              size="30"
              onClick={() => {
                setRate(idx + 1);
              }}
              color={rate >= idx + 1 ? '#FFC000' : 'lightgray'}
            />
          );
        })}
      </div>
      <div
        className="postReview"
        style={{ display: 'flex', gap: '10px', marginLeft: '10px', width: '68%' }}
      >
        <TextArea
          placeholder="댓글을 입력해주세요"
          autoSize
          onChange={(e) => {
            setContent(e.target.value);
            if (prop.courseId !== undefined) setCourseId(parseInt(prop.courseId, 10));
          }}
          value={content}
        />
        <Button type="primary" onClick={post}>
          등록
        </Button>
      </div>
    </div>
  );
}
