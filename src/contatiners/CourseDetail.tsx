import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import TMap from "../map";

export default function CourseDetail(){
    const [title, setTitle] = useState("dummy title");
    const [description, setDescription] = useState("dummy description");
    const [start, setStart] = useState("dummy start");
    const [destination, setDestination] = useState("dummy destination");
    const [u_counts, setCounts] = useState(3);
    const [e_time, setTime] = useState(50);

    const id = useParams();

    const onPlay = () => {

    };

    return (
        <div>
            <h1>{title}</h1>
            <h5>{description}</h5>
            <h6>{u_counts} people used this course!</h6>
            <h6>estimated time : {e_time}</h6>
            <button onClick={onPlay}>go to navigation</button>
            <TMap></TMap>
        </div>
    );

}