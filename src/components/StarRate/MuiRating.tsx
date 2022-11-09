import Rating from '@mui/material/Rating';
import React from 'react';

interface Iprops {
  rate: number;
}

function MuiRating(prop: Iprops) {
  const { rate } = prop;

  return <Rating readOnly value={rate} precision={0.1} />;
}

export default MuiRating;
