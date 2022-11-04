import { useNavigate } from "react-router";

const Header = () => {
    const navigate = useNavigate();
    
    const onClickCategory = (category: string) => {
        localStorage.setItem("CATEGORY_KEY", category);
        navigate("/courses");
        
    };
    return (
        <div className="header">
            <span>logo</span>
            <button onClick={() => onClickCategory("drive")}>드라이브</button>
            <button onClick={() => onClickCategory("bike")}>바이크</button>
            <button onClick={() => onClickCategory("cycle")}>자전거</button>
            <button onClick={() => onClickCategory("run")}>런닝</button>
        </div>
    );
};

export default Header;
