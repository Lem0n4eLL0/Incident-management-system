export const USER_ROLES = ['сотрудник', 'руководитель', 'администратор'] as const;
export type Role = (typeof USER_ROLES)[number];

export type Phone = string;
export type Email = string;

export type User = {
  id: string;
  role: Role;
  fullName: string;
  unit: string;
  position: string;
  telephone: Phone;
  email: Email;
};

export type UserDTO = {
  id: string;
  role: string;
  full_name: string;
  unit: string;
  position: string;
  telephone: string;
  email: string;
};

export const INCIDENT_TYPES = ['авария', 'инцидент', 'травма', 'пожар', 'другое'] as const;
export type IncidentType = (typeof INCIDENT_TYPES)[number];
export const INCIDENT_STATUSES = ['в работе', 'завершено', 'на рассмотрении'] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export type Incident = {
  id: string;
  incidentNumber: string;
  type: IncidentType;
  date: Date;
  description: string;
  unit: string;
  author: User;
  status?: IncidentStatus;
  measuresTaken?: string;
  responsible?: string;
};

export type TableIncident = Pick<Incident, 'incidentNumber' | 'type' | 'unit' | 'date' | 'status'>; // Убрать если не пределаю в строгую типизацию

export type IncidentDTO = {
  id: string;
  incident_number: string;
  type: string;
  date: string;
  description: string;
  unit: string;
  author: UserDTO;
  status?: string;
  measures_taken?: string;
  responsible?: string;
};

export type ApiError = {
  code: string | number | undefined;
  message: string | undefined;
};

export type ApiLoginRequest = {
  login: string;
  password: string;
};
