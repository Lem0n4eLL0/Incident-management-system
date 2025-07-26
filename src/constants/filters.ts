import { DateRange, Incident, User } from '@custom-types/types';
import { FilterFunc, FilterFuncAny } from '@utils/Filter';

export const filterByDateRange: FilterFuncAny<Incident> = (
  incident,
  range?: DateRange
): boolean => {
  if (!range) return true;
  const itemTime = incident.date.getTime();
  if (range.from && itemTime < range.from.getTime()) return false;
  if (range.to && itemTime >= range.to.getTime()) return false;
  return true;
};

export const unitfilter: FilterFunc<Incident, 'unit'> = (incident, value) => {
  return value ? incident.unit === value.trim() : true;
};

export const typeFilter: FilterFunc<Incident, 'type'> = (incident, value) => {
  return value ? incident.type === value : true;
};

export const statusFilter: FilterFunc<Incident, 'status'> = (incident, value) => {
  return value ? incident.status === value : true;
};

export const descriptionFilter: FilterFunc<Incident, 'description'> = (incident, value) => {
  return value ? incident.description.toLowerCase().includes(value.trim().toLowerCase()) : true;
};

export const roleFilter: FilterFunc<User, 'role'> = (incident, value) => {
  return value ? incident.role === value : true;
};

export const fullNameFilter: FilterFunc<User, 'fullName'> = (incident, value) => {
  return value ? incident.fullName.trim().toLowerCase().includes(value.trim().toLowerCase()) : true;
};
