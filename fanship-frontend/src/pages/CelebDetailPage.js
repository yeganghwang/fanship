import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCelebDetail } from '../api/celeb';
import { addFavorite } from '../api/favorite';

function CelebDetailPage({ token }) {
  const { celebId } = useParams();
  const [celebDetail, setCelebDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    }
  }, [celebId]);

  const handleAddFavorite = async () => {
    try {
      await addFavorite({ celeb_id: parseInt(celebId, 10) }, token);
      alert('즐겨찾기에 추가되었습니다.');
    } catch (err) {
      alert(`즐겨찾기 추가 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!celebDetail) return <div>셀럽 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{celebDetail.nickname} 상세 정보</h2>
      <button onClick={handleAddFavorite}>즐겨찾기 추가</button>
      <p>유형: {celebDetail.celeb_type}</p>
      <p>소속 회사: {celebDetail.company_name}</p>
      {celebDetail.ig_url && <p>인스타그램: <a href={celebDetail.ig_url} target="_blank" rel="noopener noreferrer">{celebDetail.ig_url}</a></p>}
      {celebDetail.pfp_img_url && <p>프로필 이미지: <img src={celebDetail.pfp_img_url} alt="프로필" style={{ width: '100px', height: '100px' }} /></p>}
      {celebDetail.dob && <p>생년월일: {celebDetail.dob}</p>}
    </div>
  );
}

export default CelebDetailPage;