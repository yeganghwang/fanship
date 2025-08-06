import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import GoodsList from '../components/goods/GoodsList';

function GoodsListPage() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>굿즈 목록</h1>
        <LinkContainer to="/goods/create">
          <Button variant="primary">굿즈 등록</Button>
        </LinkContainer>
      </div>
      <GoodsList />
    </>
  );
}

export default GoodsListPage;
