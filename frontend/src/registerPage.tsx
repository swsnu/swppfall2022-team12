import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export default function Register() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState([]);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [e_time, setTime] = useState(0);

  const [pageOne, setPage] = useState(true);

  if (pageOne) {
    return <div />;
  }
  return (
    <div>
      Title :{' '}
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      description :{' '}
      <input
        type="text"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      expected time :{' '}
      <input
        type="text"
        value={e_time}
        onChange={(e) => {
          setTime(Number(e.target.value));
        }}
      />
    </div>
  );
}
