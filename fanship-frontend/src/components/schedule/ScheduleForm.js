import React, { useState } from 'react';
import { createSchedule } from '../../api/schedule';

function ScheduleForm({ celebId, token, onScheduleCreated }) {
  const [scheduleType, setScheduleType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startHour, setStartHour] = useState('00');
  const [startMinute, setStartMinute] = useState('00');
  const [endDate, setEndDate] = useState('');
  const [endHour, setEndHour] = useState('00');
  const [endMinute, setEndMinute] = useState('00');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDt = `${startDate}T${startHour}:${startMinute}:00`;
      const endDt = `${endDate}T${endHour}:${endMinute}:00`;
      const scheduleData = { schedule_type: scheduleType, start_dt: startDt, end_dt: endDt };
      await createSchedule(celebId, scheduleData, token);
      alert('스케줄이 등록되었습니다.');
      onScheduleCreated(); // 부모 컴포넌트에 알림
      // 폼 초기화
      setScheduleType('');
      setStartDate('');
      setStartHour('00');
      setStartMinute('00');
      setEndDate('');
      setEndHour('00');
      setEndMinute('00');
    } catch (error) {
      alert(`스케줄 등록 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <h4>새 스케줄 등록</h4>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value)}
          placeholder="스케줄 종류"
          required
        />
      </div>
      <div className="row mb-3">
        <div className="col">
          <label>시작일</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="col">
          <label>시간</label>
          <select className="form-select" value={startHour} onChange={(e) => setStartHour(e.target.value)}>
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div className="col">
          <label>분</label>
          <select className="form-select" value={startMinute} onChange={(e) => setStartMinute(e.target.value)}>
            {minutes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <label>종료일</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className="col">
          <label>시간</label>
          <select className="form-select" value={endHour} onChange={(e) => setEndHour(e.target.value)}>
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div className="col">
          <label>분</label>
          <select className="form-select" value={endMinute} onChange={(e) => setEndMinute(e.target.value)}>
            {minutes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">등록</button>
    </form>
  );
}

export default ScheduleForm;
