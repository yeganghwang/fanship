import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCelebDetail } from '../api/celeb';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorite';
import { getPostsByUserId } from '../api/post';

function CelebDetailPage({ userId, token }) {
  const { celebId } = useParams();
  const [celebDetail, setCelebDetail] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const checkFavoriteStatus = async () => {
    if (!userId || !token) return;
    try {
      const response = await getFavorites(userId, token, { limit: 100 });
      const found = response.list.find(fav => fav.celeb_id === parseInt(celebId, 10));
      if (found) {
        setIsFavorite(true);
        setFavoriteId(found.favorite_id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (err) {
      console.error('즐겨찾기 상태 확인 실패:', err);
    }
  };

  useEffect(() => {
    const fetchCelebData = async () => {
      setLoading(true);
      try {
        const celebResponse = await getCelebDetail(celebId);
        setCelebDetail(celebResponse);

        if (celebResponse && celebResponse.user_id) {
          const postsResponse = await getPostsByUserId(celebResponse.user_id);
          setPosts(postsResponse.list);
        }

        checkFavoriteStatus();

      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (celebId) {
      fetchCelebData();
    }
  }, [celebId, userId, token]);

  const handleAddFavorite = async () => {
    try {
      await addFavorite({ celeb_id: parseInt(celebId, 10) }, token);
      alert('즐겨찾기에 추가되었습니다.');
      checkFavoriteStatus();
    } catch (err) {
      alert(`즐겨찾기 추가 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!favoriteId) return;
    try {
      await removeFavorite(favoriteId, token);
      alert('즐겨찾기에서 삭제되었습니다.');
      checkFavoriteStatus();
    } catch (err) {
      alert(`즐겨찾기 삭제 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!celebDetail) return <div>셀럽 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{celebDetail.nickname} 상세 정보</h2>
      {token && (
        isFavorite ? (
          <button onClick={handleRemoveFavorite}>즐겨찾기 삭제</button>
        ) : (
          <button onClick={handleAddFavorite}>즐겨찾기 추가</button>
        )
      )}
      <p>유형: {celebDetail.celeb_type}</p>
      <p>소속 회사: {celebDetail.company_name}</p>
      {celebDetail.ig_url && <p>인스타그램: <a href={celebDetail.ig_url} target="_blank" rel="noopener noreferrer">{celebDetail.ig_url}</a></p>}
      {celebDetail.pfp_img_url && <p>프로필 이미지: <img src={celebDetail.pfp_img_url} alt="프로필" style={{ width: '100px', height: '100px' }} /></p>}
      {celebDetail.dob && <p>생년월일: {celebDetail.dob}</p>}

      <h3>작성한 게시글</h3>
      <ul>
        {posts.map(post => (
          <li key={post.post_id}>
            <Link to={`/posts/${post.post_id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CelebDetailPage;
