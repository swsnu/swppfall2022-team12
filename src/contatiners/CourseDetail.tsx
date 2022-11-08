type Prop = {
  courseID: number;
};

export default function CourseDetail({ courseID }: Prop) {
  return (
    <h1>
      CourseDetail
      <p>{courseID}</p>
    </h1>
  );
}
