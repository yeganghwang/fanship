import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import PostList from '../components/post/PostList';

function PostListPage() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>게시판</h1>
        <LinkContainer to="/posts/create">
          <Button variant="primary">글쓰기</Button>
        </LinkContainer>
      </div>
      <PostList />
    </>
  );
}

export default PostListPage;
