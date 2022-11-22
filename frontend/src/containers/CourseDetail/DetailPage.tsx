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
    content: '[0] 출발지',
    image: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
    position: {
      lat: '37.40268656668587',
      lng: '127.10325874620656',
    },
    idx: 0,
  });

  useEffect(() => {
    axios.get(`/course/${id}/`).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setTime(res.data.e_time);
      setCounts(res.data.u_counts);
      setPoints(res.data.markers);
    });
  }, []);

  const onPlay = () => {
    const tempArray = ['nmap://navigation?'];
    const elementArray = [
      {
        content: '[0] 출발지',
        image: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
        position: {
          lat: '37.40268656668555',
          lng: '127.10325874620656',
        },
      },
    ];
    for (let index = 0; index < points.length; index += 1) {
      elementArray.push(points[index]);
    }
    for (let index = 0; index < points.length - 1; index += 1) {
      tempArray.push(
        `&v${index + 1}lat=${elementArray[index + 1].position.lat}&v${index + 1}lng=${
          elementArray[index + 1].position.lng
        }&v${index + 1}name=${encodeURIComponent(elementArray[index + 1].content.toString())}`,
      );
    }

    const a = `dlat=${elementArray[points.length].position.lat}&dlng=${
      elementArray[points.length].position.lng
    }&dname=${encodeURIComponent(elementArray[points.length].content.toString())}`;
    tempArray.splice(1, 0, a);

    tempArray.push('&appname=com.example.myapp');

    console.log(tempArray.toString().replace(/,/g, ''));

    window.location.href = tempArray.toString().replace(/,/g, '');
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
