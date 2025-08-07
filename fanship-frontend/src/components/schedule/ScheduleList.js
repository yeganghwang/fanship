import React, { useState, useEffect } from 'react';
import { getSchedules, deleteSchedule } from '../../api/schedule';
import { formatToKST } from '../../utils/date';

function ScheduleList({ celebId, token, canManage }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await getSchedules(celebId, { page, limit });
      setSchedules(response.list);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      setError(err.message || '스케줄을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (celebId) {
      fetchSchedules();
    }
  }, [celebId, page, limit]);

  const handleDelete = async (scheduleId) => {
    if (window.confirm('정말로 이 스케줄을 삭제하시겠습니까?')) {
      try {
        await deleteSchedule(scheduleId, token);
        fetchSchedules(); // 스케줄 다시 불러오기
      } catch (err) {
        alert(`스케줄 삭제 실패: ${err.message || '알 수 없는 오류'}`);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h3>스케줄</h3>
      <ul className="list-group">
        {schedules.map((schedule) => (
          <li key={schedule.schedule_id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{schedule.schedule_type}</strong>
              <br />
              <small>{formatToKST(schedule.start_dt)} ~ {formatToKST(schedule.end_dt)}</small>
            </div>
            {canManage && (
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(schedule.schedule_id)}>삭제</button>
            )}
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-light" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</button>
        <span className="align-self-center mx-3">페이지 {page} / {totalPages}</span>
        <button className="btn btn-light" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>다음</button>
      </div>
    </div>
  );
}

export default ScheduleList;