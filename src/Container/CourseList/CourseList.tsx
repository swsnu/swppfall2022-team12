import {useState, useEffect} from "react";
import { Iprops } from "../../Component/CourseListElement.tsx/CourseListElement";
import CourseListElement from "../../Component/CourseListElement.tsx/CourseListElement";
import { useNavigate } from "react-router";

const CourseList = () => {
    const navigate = useNavigate();

    type CourseElemType = {
        id: number;
        title: string;
        description: string;
        grade: number;
        f_counts: number;
    }

    const [courseItems, setCourseItems] = useState<CourseElemType[]>([]);

    useEffect(() => {
        setCourseItems([
            {
                id: 3,
                title: "운전연습",
                description: "양재, 사당 헬코스",
                grade: 3.2,
                f_counts: 40,
            },
            {
                id: 1,
                title: "한강부터 남양주까지",
                description: "한강~남양주 힐링코스",
                grade: 5,
                f_counts: 100,
            },
            {
                id: 2,
                title: "동해안 바닷바람",
                description: "한적한 강릉 해안도로 드라이브",
                grade: 4.5,
                f_counts: 500,
            },
        ]);
    }, []);

    return (
        <div className="course-list">
            {courseItems.map((course) => {
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
        
    )
};

export default CourseList;