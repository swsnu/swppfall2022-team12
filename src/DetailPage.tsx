import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export default function CourseDetail() {
  const { id } = useParams(); // get the id of the course
  const [title, setTitle] = useState('dummy title');
  const [rating, setRating] = useState(4.7);
  const [rateNum, setRateNum] = useState(19);
  const [description, setDescription] = useState('dummy description');
  const [points, setPoints] = useState([]);
  const [destination, setDestination] = useState('dummy destination');
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [u_counts, setCounts] = useState(45);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [e_time, setTime] = useState(50);
  // const [created_at, setCreateAt] = useState("");
  // const [link, setLink] = useState("");
  const [element, setElement] = useState({
    pid: 'test01',
    name: 'test01',
    latitude: '26.0000000',
    longitude: '25.0000000',
    idx: 0,
  });

  useEffect(() => {
    console.log(id);
    axios.get(`/course/${id}/`).then((res) => {
      console.log(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setTime(res.data.e_time);
      setCounts(res.data.u_counts);
      setPoints(res.data.points);
    });
  }, []);

  const onPlay = () => {
    // console.log(l);
    console.log(`point length : ${points.length}`);
    const tempArray = ['nmap://navigation?'];
    for (let index = 0; index < points.length; index += 1) {
      setElement(points[index]);
      if (index === points.length - 1) {
        const a = `dlat=${element.latitude}&dlng=${element.longitude}&dname=${encodeURI(
          '임시한국어',
        )}`;
        tempArray.splice(1, 0, a);
      } else {
        tempArray.push(
          `&v${index + 1}lat=${element.latitude}&v${index + 1}lng=${element.longitude}&v${
            index + 1
          }name=${encodeURI('임시한국어2')}`,
        );
      }
    }
    tempArray.push('&appname=com.example.myapp');
    console.log(tempArray);
    console.log(tempArray.toString().replaceAll(',', ''));
    window.location.href = tempArray.toString().replaceAll(',', '');
  };

  return (
    <div>
      <h1>{title}</h1>
      <h5>{description}</h5>
      <h6>{u_counts} people used this course!</h6>
      <h6>
        rating : {rating}({rateNum})
      </h6>
      <h6>expected time : {e_time}</h6>
      <button onClick={onPlay}>go to navigation</button>
    </div>
  );
}
