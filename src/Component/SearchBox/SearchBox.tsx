import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

interface Iprop {
    searchKey: string;
}

const SearchBox = (prop: Iprop) => {
    const navigate = useNavigate();
    const inputFocus = useRef<HTMLInputElement>(null);

    const { searchKey } = prop;
    const [searchInput, setSearchInput] = useState<string>("");

    useEffect(() => {
        setSearchInput(searchKey);
    }, [searchKey]);

    const onClickSearch = () => {
        if (searchInput === "" && inputFocus.current != null) {
            inputFocus.current.focus();
        }
        else {
            localStorage.setItem("SEARCH_KEY", searchInput);
            navigate("/courses");
        }
    }

    return (
        <div className="main-search">
            <input 
                placeholder="Search Courses"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                ref={inputFocus}
                ></input>
            <button onClick={onClickSearch}>Search</button>
        </div>
    )
}

export default SearchBox;