import { format, formatDistanceToNow, isPast, isToday, parseISO } from 'date-fns';

export const cn = (...classes) => {
          return classes.filter(Boolean).join(' ');
        };

export const formatDate = (date) => {
  if (!date) return 'No date set';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const isOverdue = (date) => {
  if (!date) return false;
  return isPast(parseISO(date)) && !isToday(parseISO(date));
};

export const timeAgo = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};