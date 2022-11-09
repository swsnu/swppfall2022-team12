import Rating from '@mui/material/Rating';
import React from 'react';

interface RateProp {
  rate: number;
}

export default function MuiRating(prop: RateProp) {
  const { rate } = prop;

  return <Rating readOnly value={rate} precision={0.1} />;
}
