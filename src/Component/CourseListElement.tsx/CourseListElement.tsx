import React from "react";
import MuiRating from "../StarRate/MuiRating";

export interface Iprops {
    id: number;
    title: string;
    description: string;
    grade: number;
    u_counts: number;
    e_time: string;
    showDetail: () => void;
}

const CourseListElement = (props: Iprops) => {
    const { id, title, description, grade, u_counts, e_time, showDetail } = props;

    return (
        <div id="course-list-element">
            <div>
                <span id="course-title" onClick={showDetail} style={{fontSize: 18, fontWeight: 600}}>{title}</span>
                <MuiRating rate={grade} /><span>{grade}</span>
            </div>
            <div>
                <span>  played {u_counts} times</span>
                <span>expected time: {e_time}</span>
            </div>
            
            <p>{description}</p>
        </div>
    )
}

export default CourseListElement;