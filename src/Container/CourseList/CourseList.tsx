import React, { useEffect} from "react";
import CourseListElement from "../../Component/CourseListElement.tsx/CourseListElement";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectCourse, fetchCoursesParams, fetchCourses, fetchCourse } from "../../store/slices/course";
import SearchBox from "../../Component/SearchBox/SearchBox";
import Header from "../../Component/Header/Header";
import { AppDispatch } from "../../store";
import ListFilter from "../../Component/ListFilter/ListFilter";

const CourseList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const courseState = useSelector(selectCourse);

    type CourseElemType = {
        id: number;
        title: string;
        description: string;
        category: string;
        grade: number;
        f_counts: number;
    }

    const init = () => {
        const params: fetchCoursesParams = {
            page: 1,
            category: localStorage.getItem("CATEGORY_KEY") ?? "drive",
            search_keyword: localStorage.getItem("SEARCH_KEY") ?? null,
            filter: localStorage.getItem("FILTER") ?? null,
        }
        dispatch(fetchCourses(params));
    };

    useEffect(() => {
        init();
    }, []);

    const korCategory = (ctgry: string) => {
        if (ctgry === "drive") return "드라이브";
        else if (ctgry === "bike") return "바이크 라이드";
        else if (ctgry === "cycle") return "자전거 라이드";
        else if (ctgry === "run") return "런닝/산책";
        else if (ctgry === "") return "";
        else return "";
    }

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h2>Courses List</h2>
            <Header />
            <h3>{korCategory(localStorage.getItem("CATEGORY_KEY") ?? "drive")}</h3>
            <div className="course-list">
                <div style={{display: "flex", justifyContent: "center"}}>
                    <SearchBox searchKey={localStorage.getItem("SEARCH_KEY")}/>
                    <ListFilter />
                </div>
                {courseState.courses.map((course) => {
                    const { id, title, description, u_counts, e_time } = course;

                    const clickTitle = async (id: CourseElemType["id"]) => {
                        await dispatch(fetchCourse(id));
                        navigate(`/course/${id}`);
                    };

                    return (
                        <CourseListElement
                            key={`course${id}`}
                            id={id}
                            title={title}
                            description={description}
                            grade={4.5}
                            u_counts={u_counts}
                            e_time={e_time}
                            showDetail={() => clickTitle(id)}
                        />
                    )
                })}
            </div>
        </div>
    )
};

export default CourseList;