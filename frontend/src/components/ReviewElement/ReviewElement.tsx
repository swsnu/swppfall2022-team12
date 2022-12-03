import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
/* eslint-disable */

interface ReviewProp {
  id: number;
  content: string;
  likes: number;
  author: string;
  rate: number;
  created_at: string;
}

export default function ReviewElement(prop: ReviewProp) {
  const ARRAY = [1, 1, 1, 1, 1];
  const [editting, setEditting] = useState<boolean>(false);
  const [newtext, setNewText] = useState<string>("");
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const [newRate, setNewRate] = useState<number>(5);



  useEffect(()=>{
    setNewText(prop.content);
    setNewRate(prop.rate);
  }, [editting])

  return (
    <div>
      <div className="author">{prop.author}</div>
      <div className="content">{prop.content}</div>
      <div className="created_at">{prop.created_at}</div>
      <div>
        {ARRAY.map((elem, idx) => {
          return <FaStar size="15" color={prop.rate >= idx + 1 ? '#d57358' : 'lightgray'} />;
        })}
      </div>
      <div className="likes">
        {prop.likes} people liked this comment
        <button
          onClick={() => {
            axios.put(`/review/like/${prop.id}/`);
          }}
        >
          like
        </button>
      </div>
      <button
        onClick={() => {
          if (prop.author === window.sessionStorage.getItem('username')) {
            setEditting(true);
          } else {
            // make Modal to notice user that he can't edit the comment
            alert('자신이 작성한 댓글만 수정 가능합니다')
          }
        }}
      >
        edit
      </button>
      <div>{editting ? <div>editting area:
        <div>
        {clicked.map((currBoolean, idx) => {
          return (
            <FaStar
              data-testid={"star"}
              size="15"
              onClick={() => {
                setNewRate(idx + 1);
              }}
              color={newRate >= idx + 1 ? '#d57358' : 'lightgray'}
            />
          );
        })}
      </div>
        <input data-testid="editting" type={"text"} onChange={(e)=>setNewText(e.target.value)} value={newtext}></input>
        <button  onClick={()=>{
          console.log(newtext)
          axios.put('/review/'+prop.id+"/", {
            content:newtext,
            rate:newRate
          }).then((res) => {
            /* eslint no-restricted-globals: ["off"] */
            setEditting(false);
            // test needed for reloading***
          });
        }}>edit</button>
      </div> : <div />}</div>
      <button
        onClick={() => {
          if(prop.author === window.sessionStorage.getItem('username')){
            axios.delete(`/review/${prop.id}/`).then((res) => {
              /* eslint no-restricted-globals: ["off"] */
              location.reload();
            });
          }else{
            alert('자신이 작성한 댓글만 삭제 가능합니다')
          }
        }}
      >
        delete
      </button>
    </div>
  );
}

