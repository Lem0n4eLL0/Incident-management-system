export type Role = 'сотрудник' | 'руководитель' | 'администратор';

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

export type IncidentType = 'авария' | 'инцидент' | 'травма' | 'пожар' | 'другое';
export type IncidentStatus = 'в работе' | 'завершено' | 'на рассмотрении';

export type Incident = {
  id: string;
  incidentNumber: string;
  type: IncidentType;
  date: Date;
  description: string;
  author: User;
  status?: IncidentStatus;
  measuresTaken?: string;
  responsible?: string;
};

export type IncidentDTO = {
  id: string;
  incident_number: string;
  type: string;
  date: string;
  description: string;
  author: UserDTO;
  status?: string;
  measures_taken?: string;
  responsible?: string;
};
