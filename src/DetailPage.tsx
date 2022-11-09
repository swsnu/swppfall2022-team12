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
    latitude: '37.513272317072',
    longitude: '127.09431687965',
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
    const elementArray = [{
        pid: 'test01',
        name: 'test01',
        latitude: '37.513272317072',
        longitude: '127.09431687965',
        idx: 0,
      }];
    for (let index = 0; index < points.length; index++) {
        elementArray.push(points[index]);
    }
    for (let index = 0; index < points.length; index++) {
        
        console.log(elementArray[index+1]);
      if (index === points.length - 1) {
        const a = `dlat=${elementArray[index+1].latitude}&dlng=${elementArray[index+1].longitude}&dname=${encodeURI(
            elementArray[index+1].name,
        )}`;
        tempArray.splice(1, 0, a);
      } else {
        tempArray.push(
          `&v${index + 1}lat=${elementArray[index+1].latitude}&v${index + 1}lng=${elementArray[index+1].longitude}&v${
            index + 1
          }name=${encodeURI(elementArray[index+1].name)}`,
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
