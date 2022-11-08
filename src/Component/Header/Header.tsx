import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { fetchCoursesParams, fetchCourses } from "../../store/slices/course";
import { AppDispatch } from "../../store";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const onClickCategory = async (category: string) => {
        const prior = localStorage.getItem("CATEGORY_KEY");
        if (prior !== category) {
            localStorage.setItem("CATEGORY_KEY", category);
            localStorage.removeItem("SEARCH_KEY");

            const params: fetchCoursesParams = {
                page: 1,
                category: localStorage.getItem("CATEGORY_KEY") ?? "drive",
                search_keyword: null,
                filter: null,
            }
            
            await dispatch(fetchCourses(params));
        }
        navigate("/courses");
    };

    return (
        <div className="header" style={{width: "50%"}}>
            <div style={{height: "30px"}}></div>
            <div style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                <span>Course Lab</span>
                <button onClick={() => onClickCategory("drive")}>드라이브</button>
                <button onClick={() => onClickCategory("bike")}>바이크</button>
                <button onClick={() => onClickCategory("cycle")}>자전거</button>
                <button onClick={() => onClickCategory("run")}>런닝</button>
            </div>
        </div>
    );
};

export default Header;
