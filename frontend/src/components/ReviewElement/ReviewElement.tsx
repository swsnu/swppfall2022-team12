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
  change: number;
  setChange : (change: number)=>void;
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
            if (sessionStorage.getItem('username') === null) {
              alert('로그인하셔야 댓글을 좋아할 수 잇습니다!');
              return;
            }
            if (prop.author === window.sessionStorage.getItem('username')) {
              alert('자신이 작성한 댓글은 좋아할수 없습니다')
            }else{
              axios.get(`/api/review/${prop.id}/like/`);
              prop.setChange(Math.random());
            }
          }}
        >
          like
        </button>
      </div>
      
      <div>{editting ? <div>
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
      </div>editting area:
        <input data-testid="editting" type={"text"} onChange={(e)=>setNewText(e.target.value)} value={newtext}></input>
        <button  onClick={()=>{
          console.log(newtext)
          axios.put('/api/review/'+prop.id+"/", {
            content:newtext,
            rate:newRate
          }, {
            headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` },
          }).then((res) => {
            /* eslint no-restricted-globals: ["off"] */
            setEditting(false);
            prop.setChange(Math.random());
            // test needed for reloading***
          });
        }}>confirm</button>
      </div> : <div />}</div>
      {
      prop.author != window.sessionStorage.getItem('username')?
          <div></div>:
          <div>
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
      <button
        onClick={() => {
          if(prop.author === window.sessionStorage.getItem('username')){
            axios.delete(`/api/review/${prop.id}/`, {
              headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` },
            }).then((res) => {
              /* eslint no-restricted-globals: ["off"] */
              prop.setChange(Math.random());
            });
          }else{
            alert('자신이 작성한 댓글만 삭제 가능합니다')
          }
        }}
      >
        delete
      </button>
      </div>

      }
      
    </div>
  );
}


