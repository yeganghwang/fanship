import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { createPost } from '../api/post';
import PostForm from '../components/post/PostForm';

function PostCreatePage({ token }) {
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    try {
      const newPost = await createPost(postData, token);
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate(`/posts/${newPost.post_id}`);
    } catch (error) {
      alert(`게시글 작성 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <>
      <h1 className="mb-4">새 게시글 작성</h1>
      <Card>
        <Card.Body>
          <PostForm onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </>
  );
}

export default PostCreatePage;
