import { useEffect } from "react";
import React , { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Register(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState([]);
    const [e_time, setTime] = useState(0);

    const [pageOne, setPage] = useState(true);



    if(pageOne){
        return(
            <div>

            </div>
        )
    }else{
        return(
            <div>
                Title : <input type="text" value={title} onChange={(e) => {setTitle(e.target.value) }}></input>
                description : <input type="text" value={description} onChange={(e) => {setDescription(e.target.value) }}></input>
                estimated time : <input type="text" value={e_time} onChange={(e) => {setTime(Number(e.target.value)) }}></input>
            </div>
        )
    }

}