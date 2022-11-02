import StarRate from "../StarRate/StarRate";

export interface Iprops {
    id: number;
    title: string;
    description: string;
    grade: number;
    f_counts: number;
    showDetail: () => void;
}

const CourseListElement = (props: Iprops) => {
    const { id, title, description, grade, f_counts, showDetail } = props;

    return (
        <div id="course-list-element">
            <h3 id="course-title" onClick={showDetail}>{title}</h3>
            <div>
                <StarRate id={id} rate={grade}/><span>{grade}</span>
                <span>  {f_counts} likes</span>
            </div>
            
            <p>{description}</p>
        </div>
    )
}

export default CourseListElement;