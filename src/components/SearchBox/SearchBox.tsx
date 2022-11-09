import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { fetchCoursesParams, fetchCourses } from "../../store/slices/course";
import { AppDispatch } from "../../store";

interface SearchProp {
    searchKey: string | null;
}

const SearchBox = (prop: SearchProp) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const inputFocus = useRef<HTMLInputElement>(null);

    const { searchKey } = prop;
    const [searchInput, setSearchInput] = useState<string>("");

    useEffect(() => {
        setSearchInput(searchKey ?? "");
    }, [searchKey]);

    const onClickSearch = async () => {
        if (searchInput === "" && inputFocus.current != null) {
            inputFocus.current.focus();
        }
        else {
            localStorage.setItem("SEARCH_KEY", searchInput);
            const params: fetchCoursesParams = {
                page: 1,
                category: localStorage.getItem("CATEGORY_KEY") ?? "drive",
                search_keyword: localStorage.getItem("SEARCH_KEY") ?? null,
                filter: localStorage.getItem("FILTER") ?? null,
            }
            
            await dispatch(fetchCourses(params));
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