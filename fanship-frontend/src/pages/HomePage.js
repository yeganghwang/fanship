import React from 'react';

function HomePage({ userId, position, companyId, celebId, ceoId, onLogout }) {
  return (
    <div>
      <h1>Fanship Frontend</h1>
      <p>현재 로그인한 사용자 ID: {userId}</p>
      <p>현재 로그인한 사용자 타입: {position}</p>
      {companyId && <p>현재 로그인한 사용자 회사 ID: {companyId}</p>}
      {celebId && <p>현재 로그인한 사용자 셀럽 ID: {celebId}</p>}
      {ceoId && <p>현재 로그인한 사용자 CEO ID: {ceoId}</p>}
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
}

export default HomePage;