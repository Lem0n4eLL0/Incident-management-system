import { Role, UserDTO, User, IncidentDTO, Incident, IncidentType, IncidentStatus } from './types';

export const mapUserFromDto = ({
  id,
  role,
  full_name,
  unit,
  position,
  telephone,
  email,
}: UserDTO): User => ({
  id,
  role: role as Role,
  fullName: full_name,
  unit,
  position,
  telephone,
  email,
});

export const mapUserToDto = ({
  id,
  role,
  fullName,
  unit,
  position,
  telephone,
  email,
}: User): UserDTO => ({
  id,
  role,
  full_name: fullName,
  unit,
  position,
  telephone,
  email,
});

export const mapIncidentToDto = ({
  id,
  incidentNumber,
  type,
  date,
  description,
  unit,
  author,
  status,
  measuresTaken,
  responsible,
}: Incident): IncidentDTO => ({
  id,
  incident_number: incidentNumber,
  type,
  date: date.toISOString(),
  description,
  unit,
  author: mapUserToDto(author),
  status,
  measures_taken: measuresTaken,
  responsible,
});

export const mapIncidentFromDto = ({
  id,
  incident_number,
  type,
  date,
  author,
  status,
  unit,
  description,
  responsible,
  measures_taken,
}: IncidentDTO): Incident => ({
  id,
  incidentNumber: incident_number,
  type: type as IncidentType,
  date: new Date(date),
  author: mapUserFromDto(author),
  status: (status ?? '') as IncidentStatus,
  unit,
  description,
  responsible,
  measuresTaken: measures_taken ?? '',
});
