import { Role, UserDTO, User, IncidentDTO, Incident, IncidentType, IncidentStatus } from './types';

export const mapUserFromDto = ({ role, full_name, ...rest }: UserDTO): User => ({
  role: role as Role,
  fullName: full_name,
  ...rest,
});

export const mapUserToDto = ({ fullName, ...rest }: User): UserDTO => ({
  full_name: fullName,
  ...rest,
});

export const mapIncidentToDto = ({
  incidentNumber,
  date,
  author,
  status,
  ...rest
}: Incident): IncidentDTO => ({
  incident_number: incidentNumber,
  date: date.toISOString(),
  author: mapUserToDto(author),
  status: status ?? '',
  ...rest,
});

export const mapIncidentFromDto = ({
  incident_number,
  type,
  date,
  author,
  status,
  ...rest
}: IncidentDTO): Incident => ({
  incidentNumber: incident_number,
  type: type as IncidentType,
  date: new Date(date),
  author: mapUserFromDto(author),
  status: status as IncidentStatus,
  ...rest,
});
