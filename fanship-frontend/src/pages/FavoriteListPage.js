import React from 'react';
import FavoriteList from '../components/favorite/FavoriteList';

function FavoriteListPage({ userId, token }) {
  return (
    <>
      <h1 className="mb-4">즐겨찾기 목록</h1>
      <FavoriteList userId={userId} token={token} />
    </>
  );
}

export default FavoriteListPage;
