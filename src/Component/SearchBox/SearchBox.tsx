import { useState, useRef } from "react";
import { useNavigate } from "react-router";

const SearchBox = () => {
    const navigate = useNavigate();
    const inputFocus = useRef<HTMLInputElement>(null);
    const [searchInput, setSearchInput] = useState<string>("");
    const onClickSearch = () => {
        if (searchInput === "" && inputFocus.current != null) {
            inputFocus.current.focus();
        }
        else {
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