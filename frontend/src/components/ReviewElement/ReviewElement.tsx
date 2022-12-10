import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';
import { List, Input, Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ReviewProp {
  id: number;
  content: string;
  likes: number;
  author: string;
  rate: number;
  created_at: string;
  change: number;
  setChange: (change: number) => void;
}

export const formatDate = (time: string) => {
  const newDate = new Date(time);
  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const date = newDate.getDate();

  const hour = newDate.getHours();
  const min = newDate.getMinutes();

  const formedDate = `${year}.${month >= 10 ? month : `0${month}`}.${
    date >= 10 ? date : `0${date}`
  } ${hour >= 10 ? hour - 12 : `0${hour}`}:${min >= 10 ? min : `0${min}`} ${
    hour >= 10 ? `PM` : `AM`
  }`;

  return formedDate;
};

export default function ReviewElement(prop: ReviewProp) {
  const ARRAY = [1, 1, 1, 1, 1];
  const [edit, setEdit] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>('');
  const [clicked] = useState([false, false, false, false, false]);
  const [newRate, setNewRate] = useState<number>(5);

  useEffect(() => {
    setNewText(prop.content);
    setNewRate(prop.rate);
  }, [edit]);

  return (
    <List.Item>
      {edit ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            {clicked.map((currBoolean, idx) => (
              <FaStar
                data-testid="star"
                size="18"
                onClick={() => {
                  setNewRate(idx + 1);
                }}
                color={newRate >= idx + 1 ? '#FFC000' : 'lightgray'}
              />
            ))}
          </div>
          <Input
            data-testid="editting"
            type="text"
            onChange={(e) => setNewText(e.target.value)}
            value={newText}
          />
          <Button
            type="primary"
            onClick={() => {
              axios
                .put(
                  `/api/review/${prop.id}/`,
                  {
                    content: newText,
                    rate: newRate,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${window.sessionStorage.getItem('access')}`,
                    },
                  },
                )
                .then(() => {
                  /* eslint no-restricted-globals: ["off"] */
                  setEdit(false);
                  prop.setChange(Math.random());
                  // test needed for reloading***
                });
            }}
          >
            수정
          </Button>
          <Button onClick={() => setEdit(false)}>취소</Button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className="stars">
            {ARRAY.map((elem, idx) => (
              <FaStar size="18" color={prop.rate >= idx + 1 ? '#FFC000' : 'lightgray'} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
            <div className="content" style={{ overflowWrap: 'break-word', display: 'inline' }}>
              {prop.content}
            </div>
            <div className="author" style={{ color: '#0074CC' }}>
              {prop.author}
            </div>
            <div className="created_at" style={{ color: '#838C95' }}>
              {formatDate(prop.created_at)}
            </div>
          </div>
          <div className="likes" style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              style={{ color: 'red', padding: '5px' }}
              onClick={() => {
                if (prop.author === window.sessionStorage.getItem('username')) {
                  toast.warning('자신이 작성한 댓글은 좋아할수 없습니다');
                } else {
                  axios
                    .get(`/api/review/${prop.id}/like/`, {
                      headers: {
                        Authorization: `Bearer ${window.sessionStorage.getItem('access')}`,
                      },
                    })
                    .then(() => {
                      prop.setChange(Math.random());
                    });
                }
              }}
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <p style={{ fontSize: '16px', margin: 0 }}>{prop.likes}</p>
          </div>
          {prop.author === window.sessionStorage.getItem('username') ? (
            <div>
              <IconButton
                onClick={() => {
                  if (prop.author === window.sessionStorage.getItem('username')) {
                    setEdit(true);
                  } else {
                    // make Modal to notice user that he can't edit the comment
                    toast.warning('자신이 작성한 댓글만 수정 가능합니다');
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                style={{ padding: 0 }}
                onClick={() => {
                  if (prop.author === window.sessionStorage.getItem('username')) {
                    axios
                      .delete(`/api/review/${prop.id}/`, {
                        headers: {
                          Authorization: `Bearer ${window.sessionStorage.getItem('access')}`,
                        },
                      })
                      .then(() => {
                        prop.setChange(Math.random());
                      });
                  } else {
                    toast.warning('자신이 작성한 댓글만 삭제 가능합니다');
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          ) : (
            <div />
          )}
        </div>
      )}
    </List.Item>
  );
}
