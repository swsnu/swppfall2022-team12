import React, { useEffect } from 'react';

import Header from '../../components/Header/Header';
import SearchBox from '../../components/SearchBox/SearchBox';

function MainPage() {
  useEffect(() => {
    localStorage.removeItem('CATEGORY_KEY');
    localStorage.removeItem('SEARCH_KEY');
    localStorage.removeItem('FILTER');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2>Main Page</h2>
      <Header />
      <SearchBox searchKey={localStorage.getItem('SEARCH_KEY') ?? ''} />
    </div>
  );
}
//
export default MainPage;
