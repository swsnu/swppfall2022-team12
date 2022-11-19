import React, { useEffect, useState } from 'react';

export default function PostCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState([]);
  const [expectedTime, setExpectedTime] = useState(0);

  const [page, setPage] = useState(true);

  // if (page) {
  //   return <div />;
  // }
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
        value={expectedTime}
        onChange={(e) => {
          setExpectedTime(Number(e.target.value));
        }}
      />
    </div>
  );
}
