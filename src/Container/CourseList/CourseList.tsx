import {useState, useEffect} from "react";
import CourseListElement from "../../Component/CourseListElement.tsx/CourseListElement";
import { useNavigate } from "react-router";
import SearchBox from "../../Component/SearchBox/SearchBox";

// interface Iprops {
//     searchKey: string | null;
//     category: string | null;
// }

const CourseList = () => {
    const navigate = useNavigate();

    type CourseElemType = {
        id: number;
        title: string;
        description: string;
        category: string;
        grade: number;
        f_counts: number;
    }

    const [category, setCategory] = useState<string>("");
    const [courseItems, setCourseItems] = useState<CourseElemType[]>([]);

    const init = () => {
        let category_key = localStorage.getItem("CATEGORY_KEY")
        if (category_key !== null) setCategory(category_key);
    };

    useEffect(() => {
        setCourseItems([
            {
                id: 3,
                title: "운전연습",
                description: "양재, 사당 헬코스",
                category: "drive",
                grade: 3.2,
                f_counts: 40,
            },
            {
                id: 1,
                title: "한강부터 남양주까지",
                description: "한강~남양주 힐링코스",
                category: "bike",
                grade: 5,
                f_counts: 100,
            },
            {
                id: 2,
                title: "동해안 바닷바람",
                description: "한적한 강릉 해안도로 드라이브",
                category: "drive",
                grade: 4.5,
                f_counts: 500,
            },
        ]);
        init();
    }, []);

    const getCategory = (ctgry: string) => {
        if (ctgry === "drive") return "드라이브";
        else if (ctgry === "bike") return "바이크 라이드";
        else if (ctgry === "cycle") return "자전거 라이드";
        else if (ctgry === "run") return "런닝/산책";
        else if (ctgry === "") return "";
        else return "";
    }

    return (
        <>
            <h3>{getCategory(category)}</h3>
            <div className="course-list">
                <SearchBox />
                {courseItems.filter(course => course.category === category).map((course) => {
                    const { id, title, description, grade, f_counts } = course;

                    const clickTitle = async (id: CourseElemType["id"]) => {
                        navigate(`/course/${id}`);
                    };

                    return (
                        <CourseListElement
                            key={`course${id}`}
                            id={id}
                            title={title}
                            description={description}
                            grade={grade}
                            f_counts={f_counts}
                            showDetail={() => clickTitle(id)}
                        />
                    )
                })}
            </div>
        </>
    )
};

export default CourseList;