import React from 'react';
import FavoriteList from '../components/favorite/FavoriteList';

function FavoriteListPage({ userId, token }) {
  return (
    <div>
      <h1>즐겨찾기 목록 페이지</h1>
      <FavoriteList userId={userId} token={token} />
    </div>
  );
}

export default FavoriteListPage;
