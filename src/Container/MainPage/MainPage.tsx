import React, { useEffect } from "react";
import Header from "../../Component/Header/Header";
import SearchBox from "../../Component/SearchBox/SearchBox";

const MainPage = () => {
    useEffect(() => {
        localStorage.removeItem("CATEGORY_KEY");
        localStorage.removeItem("SEARCH_KEY");
        localStorage.removeItem("FILTER");
    }, []);

    return (
        <>
            <h2>Main Page</h2>
            <Header />
            <SearchBox searchKey={localStorage.getItem("SEARCH_KEY") ?? ""} />
        </>
    );
};
// 
export default MainPage;
