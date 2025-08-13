import React, { useState, useEffect, useMemo } from 'react';
import { getSchedules, deleteSchedule } from '../../api/schedule';
import { formatToKST } from '../../utils/date';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';

function ScheduleList({ celebId, token, canManage }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 달력 상태
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null); // Date 객체
  const [showModal, setShowModal] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // 모든 스케줄(기간 필터 없다고 가정). 필요 시 API에 month 파라미터 추가하도록 확장 가능.
      const response = await getSchedules(celebId, { page: 1, limit: 500 }); // 충분히 크게
      setSchedules(response.list || []);
    } catch (err) {
      setError(err.message || '스케줄을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (celebId) fetchSchedules();
  }, [celebId]);

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('정말로 이 스케줄을 삭제하시겠습니까?')) return;
    try {
      setDeleting(true);
      await deleteSchedule(scheduleId, token);
      await fetchSchedules();
    } catch (err) {
      alert(`스케줄 삭제 실패: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setDeleting(false);
    }
  };

  // YYYY-MM-DD
  const toKey = (d) => d.toISOString().slice(0, 10);
  const dateOnlyKey = (iso) => {
    const d = new Date(iso);
    // 표준화(시차 보정 위해)
    const local = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return toKey(local);
  };

  // 날짜 범위 포함 처리 (start~end 포함 모든 날짜)
  const scheduleMap = useMemo(() => {
    const map = {};
    schedules.forEach(s => {
      const start = new Date(s.start_dt);
      const end = new Date(s.end_dt);
      // 자정 기준으로 루프
      let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      while (cur <= last) {
        const k = toKey(cur);
        if (!map[k]) map[k] = [];
        map[k].push(s);
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [schedules]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-based
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startWeekDay = firstDayOfMonth.getDay(); // 0=Sun
  const daysInMonth = lastDayOfMonth.getDate();

  // 캘린더 셀 생성
  const calendarCells = [];
  for (let i = 0; i < startWeekDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(new Date(year, month, d));
  }
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const selectedKey = selectedDate ? toKey(selectedDate) : null;
  const selectedSchedules = selectedKey ? (scheduleMap[selectedKey] || []) : [];

  const openDateModal = (dateObj) => {
    setSelectedDate(dateObj);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    // setSelectedDate(null); // 닫을 때 날짜 유지하려면 주석 처리
  };

  const goPrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  const goNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h3>스케줄</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={goPrevMonth}>이전달</button>
        <h5 className="mb-0">{year}년 {month + 1}월</h5>
        <button className="btn btn-outline-secondary btn-sm" onClick={goNextMonth}>다음달</button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center mb-0" style={{ tableLayout: 'fixed' }}>
          <thead className="table-light">
            <tr>
              {['일','월','화','수','목','금','토'].map(d => <th key={d} style={{ width: '14.28%' }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: calendarCells.length / 7 }).map((_, rowIdx) => (
              <tr key={rowIdx} style={{ height: 100 }}>
                {calendarCells.slice(rowIdx * 7, rowIdx * 7 + 7).map((dateObj, i) => {
                  if (!dateObj) return <td key={i} className="bg-light"></td>;
                  const key = toKey(dateObj);
                  const daySchedules = scheduleMap[key] || [];
                  const isToday = toKey(new Date()) === key;
                  const isSelected = selectedKey === key;
                  return (
                    <td
                      key={i}
                      onClick={() => openDateModal(dateObj)}
                      style={{
                        cursor: 'pointer',
                        verticalAlign: 'top',
                        backgroundColor: isSelected ? '#e3f2fd' : undefined,
                        border: isToday ? '2px solid #0d6efd' : undefined
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <span style={{ fontSize: 12 }}>{dateObj.getDate()}</span>
                        {daySchedules.length > 0 && (
                          <span className="badge bg-primary" style={{ fontSize: 10 }}>
                            {daySchedules.length}
                          </span>
                        )}
                      </div>
                      <div className="mt-1" style={{ textAlign: 'left' }}>
                        {daySchedules.slice(0,3).map(s => (
                          <div key={s.schedule_id} style={{ fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            • {s.schedule_type}
                          </div>
                        ))}
                        {daySchedules.length > 3 && (
                          <div style={{ fontSize: 11 }}>+{daySchedules.length - 3} 더보기</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-muted" style={{ fontSize: 12 }}>날짜를 클릭하면 상세 스케줄이 표시됩니다.</div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDate && (
              <>
                {selectedDate.getFullYear()}-{('0'+(selectedDate.getMonth()+1)).slice(-2)}-{('0'+selectedDate.getDate()).slice(-2)}{' '}
                <Badge bg="primary">{selectedSchedules.length}</Badge>
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {selectedSchedules.length === 0 && <div className="text-muted">스케줄 없음</div>}
          {selectedSchedules.length > 0 && (
            <ListGroup variant="flush">
              {selectedSchedules.map(s => (
                <ListGroup.Item key={s.schedule_id} className="d-flex justify-content-between align-items-start">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fw-bold" style={{ fontSize: 14 }}>{s.schedule_type}</div>
                    <div style={{ fontSize: 12 }}>
                      {formatToKST(s.start_dt)}<br />~ {formatToKST(s.end_dt)}
                    </div>
                  </div>
                  {canManage && (
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={deleting}
                      onClick={() => handleDelete(s.schedule_id)}
                    >
                      {deleting ? '...' : '삭제'}
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ScheduleList;