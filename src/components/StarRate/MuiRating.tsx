import React from "react";
import Rating from "@mui/material/Rating";

interface RateProp {
    rate: number;
}

const MuiRating = (prop: RateProp) => {
    const { rate } = prop;

    return <Rating 
        readOnly
        value={rate}
        precision={0.1}
    />
}

export default MuiRating;