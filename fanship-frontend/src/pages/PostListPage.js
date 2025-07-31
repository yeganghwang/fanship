import React from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/post/PostList';

function PostListPage() {
  return (
    <div>
      <h1>게시판</h1>
      <Link to="/posts/create">
        <button>글쓰기</button>
      </Link>
      <PostList />
    </div>
  );
}

export default PostListPage;
