import { format } from 'date-fns';

export const formatToKST = (dateString) => {
  if (!dateString) return '';
  // Z(UTC) 제거: "2025-08-08T17:45:11.000Z" → "2025-08-08T17:45:11.000"
  const localString = dateString.replace(/Z$/, '');
  return format(new Date(localString), 'yyyy-MM-dd HH:mm:ss');
};
