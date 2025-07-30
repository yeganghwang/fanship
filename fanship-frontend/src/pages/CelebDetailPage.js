import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCelebDetail } from '../api/celeb';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorite';

function CelebDetailPage({ userId, token }) {
  const { celebId } = useParams();
  const [celebDetail, setCelebDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const checkFavoriteStatus = async () => {
    if (!userId || !token) return;
    try {
      const response = await getFavorites(userId, token, { limit: 100 }); // 모든 즐겨찾기 가져와서 확인
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
    const fetchCelebDetail = async () => {
      setLoading(true);
      try {
        const response = await getCelebDetail(celebId);
        setCelebDetail(response);
      } catch (err) {
        setError(err.message || '셀럽 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (celebId) {
      fetchCelebDetail();
      checkFavoriteStatus();
    }
  }, [celebId, userId, token]);

  const handleAddFavorite = async () => {
    try {
      await addFavorite({ celeb_id: parseInt(celebId, 10) }, token);
      alert('즐겨찾기에 추가되었습니다.');
      checkFavoriteStatus(); // 상태 업데이트
    } catch (err) {
      alert(`즐겨찾기 추가 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!favoriteId) return;
    try {
      await removeFavorite(favoriteId, token);
      alert('즐겨찾기에서 삭제되었습니다.');
      checkFavoriteStatus(); // 상태 업데이트
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
      {token && ( // 로그인 상태일 때만 버튼 표시
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
    </div>
  );
}

export default CelebDetailPage;
