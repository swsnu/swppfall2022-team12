import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export default function Register() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState([]);
  const [estimatedTime, setTime] = useState(0);

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
      estimated time :{' '}
      <input
        type="text"
        value={estimatedTime}
        onChange={(e) => {
          setTime(Number(e.target.value));
        }}
      />
    </div>
  );
}
