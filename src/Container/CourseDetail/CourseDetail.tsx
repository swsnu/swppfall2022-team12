import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { selectCourse } from "../../store/slices/course";

const CourseDetail = () => {
    const courseState = useSelector(selectCourse);
    const navigate = useNavigate();

    if (!courseState.selectedCourse) navigate("/");

    return (
        <>
            <div>This is detail page</div>
            <div>Title : {courseState.selectedCourse?.title}</div>
        </>
        
    )
}

export default CourseDetail;