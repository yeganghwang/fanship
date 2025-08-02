import React from 'react';
import { Link } from 'react-router-dom';
import GoodsList from '../components/goods/GoodsList';

function GoodsListPage() {
  return (
    <div>
      <h1>굿즈 목록</h1>
      <Link to="/goods/create">
        <button>굿즈 등록</button>
      </Link>
      <GoodsList />
    </div>
  );
}

export default GoodsListPage;
