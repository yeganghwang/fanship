import { formatInTimeZone } from 'date-fns-tz';

export const formatToKST = (dateString) => {
  if (!dateString) return '';
  // UTC 시간을 한국 시간으로 변환하고, 원하는 형식으로 포맷합니다.
  return formatInTimeZone(dateString, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
};
