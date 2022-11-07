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
            <h3 id="course-title" onClick={showDetail}>{title}</h3>
            <div>
                <MuiRating rate={grade} /><span>{grade}</span>
                <span>  played {u_counts} times</span>
                <span>expected time: {e_time}</span>
            </div>
            
            <p>{description}</p>
        </div>
    )
}

export default CourseListElement;