import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

interface ReviewProp {
  id: number;
  content: string;
  likes: number;
  author: string;
  rate: number;
  created_at: string;
}

export default function ReviewElement(prop: ReviewProp) {
  const ARRAY = [1, 1, 1, 1, 1];
  const [editting, setEditting] = useState<boolean>(false);
  return (
    <div>
      <div className="author">{prop.author}</div>
      <div className="content">{prop.content}</div>
      <div className="created_at">{prop.created_at}</div>
      <div>
        {ARRAY.map((elem, idx) => {
          return <FaStar size="10" color={prop.rate >= idx + 1 ? '#d57358' : 'lightgray'} />;
        })}
      </div>
      <div className="likes">
        {prop.likes} people liked this comment
        <button
          onClick={() => {
            axios.put(`/review/like/${prop.id}/`);
          }}
        >
          like
        </button>
      </div>
      <button
        onClick={() => {
          if (prop.author === 'sihoo') {
            // need to be fixed due to login issue
            setEditting(true);
          } else {
            // make Modal to notice user that he can't edit the comment
          }
        }}
      >
        edit
      </button>
      <div>{editting ? <div>editting area</div> : <div />}</div>
      <button
        onClick={() => {
          // need to be fixed due to login issue(Not everybody can delete!)
          axios.delete(`/review/${prop.id}/`).then((res) => {
            /* eslint no-restricted-globals: ["off"] */
            location.reload();
          });
        }}
      >
        delete
      </button>
    </div>
  );
}
