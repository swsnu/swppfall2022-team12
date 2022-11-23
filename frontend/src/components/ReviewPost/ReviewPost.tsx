import axios from 'axios';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

interface ReviewPostProp {
  courseId: string | undefined;
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
      .post('/review/', data)
      .then((res) => {
        /* eslint no-restricted-globals: ["off"] */
        location.reload();
        //test needed for reloading***
      })
  };

  return (
    <div>
      <div>
        {clicked.map((currBoolean, idx) => {
          return (
            <FaStar
              data-testid='star'
              size="30"
              onClick={() => {
                setRate(idx + 1);
              }}
              color={rate >= idx + 1 ? '#d57358' : 'lightgray'}
            />
          );
        })}
      </div>
      <input
        type="text"
        placeholder="댓글을 입력해주세요"
        onChange={(e) => {
          setContent(e.target.value);
          if (prop.courseId !== undefined) setCourseId(parseInt(prop.courseId, 10));
        }}
        value={content}
      />

      <button type="button" onClick={post}>
        post
      </button>
    </div>
  );
}
