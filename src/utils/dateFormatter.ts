export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') return date.split('T')[0];
  return date.toISOString().split('T')[0];
};
