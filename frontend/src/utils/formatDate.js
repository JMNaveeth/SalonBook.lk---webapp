import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return isValid(date) ? format(date, 'MMM dd, yyyy') : dateString;
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  if (hours === undefined || minutes === undefined) return timeString;
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};
