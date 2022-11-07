import React from "react";
import Header from "../../Component/Header/Header";
import SearchBox from "../../Component/SearchBox/SearchBox";

const MainPage = () => {
    const searchKey = localStorage.getItem("SEARCH_KEY");

    return (
        <>
            <h2>Main Page</h2>
            <Header />
            <SearchBox searchKey={searchKey ? searchKey : ""}/>
        </>
        
    );
}

export default MainPage;