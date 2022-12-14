import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';
import { List, Input, Button, Col, Row } from 'antd';
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
    <List.Item style={{ padding: '20px 0' }}>
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
            ??????
          </Button>
          <Button onClick={() => setEdit(false)}>??????</Button>
        </div>
      ) : (
        <Row style={{ display: 'flex', alignItems: 'center' }}>
          <Col className="stars" flex={2}>
            {ARRAY.map((elem, idx) => (
              <FaStar
                key={elem + Math.random()}
                size="18"
                color={prop.rate >= idx + 1 ? '#FFC000' : 'lightgray'}
              />
            ))}
          </Col>
          <Col
            style={{
              gap: '5px',
              marginLeft: '10px',
              marginRight: '10px',
              overflowWrap: 'break-word',
              display: 'inline',
              width: '250px',
            }}
          >
            {prop.content}
          </Col>
          <Col style={{ width: '60px', marginRight: '20px' }}>
            <div className="author" style={{ color: '#0074CC' }}>
              {prop.author}{' '}
            </div>
            <div className="created_at" style={{ color: '#838C95' }}>
              {formatDate(prop.created_at)}
            </div>
          </Col>

          <Col className="likes" style={{ display: 'flex', alignItems: 'center' }} flex={2}>
            <IconButton
              style={{ color: 'red', padding: '5px' }}
              onClick={() => {
                if (prop.author === window.sessionStorage.getItem('username')) {
                  toast.warning('????????? ????????? ????????? ???????????? ????????????');
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
          </Col>
          {prop.author === window.sessionStorage.getItem('username') ? (
            <Col flex={2}>
              <IconButton
                onClick={() => {
                  if (prop.author === window.sessionStorage.getItem('username')) {
                    setEdit(true);
                  } else {
                    // make Modal to notice user that he can't edit the comment
                    toast.warning('????????? ????????? ????????? ?????? ???????????????');
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
                    toast.warning('????????? ????????? ????????? ?????? ???????????????');
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Col>
          ) : (
            <div />
          )}
        </Row>
      )}
    </List.Item>
  );
}
