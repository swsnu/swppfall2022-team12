import { useEffect } from "react";
import React , { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import TMap from "./components/TMap.js";
import "./components/dummyData.js"
import { dummyData } from "./components/dummyData.js";




export default function CourseDetail(){
    const [title, setTitle] = useState("dummy title");
    const [description, setDescription] = useState("dummy description");
    const [startX, setStartX] = useState("dummy start");
    const [startY, setStartY] = useState("dummy start");
    const [destination, setDestination] = useState("dummy destination");
    const [u_counts, setCounts] = useState(3);
    const [e_time, setTime] = useState(50);

    const id = useParams();

    const onPlay = () => {
        const data = JSON.parse(dummyData);
        const viadata = data.viaPoints;
        const link = "nmap://navigation?dlat="+data.startY+"&dlng="+data.startX+"&dname=%EC%B5%9C%EC%A2%85%EB%8F%84%EC%B0%A9%EC%A7%80"+"&v1lat="+viadata[0].viaY+"&v1lng="+viadata[0].viaX+"&v1name=%EC%B6%9C%EB%B0%9C%EC%A7%80"+"&v2lat="+viadata[1].viaY+"&v2lng="+viadata[1].viaX+"&v2name=%EA%B2%BD%EC%9C%A0%EC%A7%80"+"&appname=com.example.myapp";
        console.log(link);
        if (link) window.location.href = link;
    };

    return (
        <div>
            <h1>{title}</h1>
            <h5>{description}</h5>
            <h6>{u_counts} people used this course!</h6>
            <h6>estimated time : {e_time}</h6>
            <button onClick={onPlay}>go to navigation</button>
        </div>
    );

}