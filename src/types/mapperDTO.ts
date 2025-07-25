import {
  Role,
  UserDTO,
  User,
  IncidentDTO,
  Incident,
  IncidentType,
  IncidentStatus,
  FullUserDTO,
  FullUser,
  UserWithAuthDTO,
  UserWithAuth,
  CreateReportData,
  CreateReportDataDTO,
} from './types';

export const preparingRole = (role: string) => {
  return role === 'администратор'
    ? 'admin'
    : role === 'руководитель'
      ? 'manager'
      : role === 'сотрудник'
        ? 'employee'
        : 'employee';
};

export const roleFromDTO = (role: string): Role => {
  return role === 'admin'
    ? 'администратор'
    : role === 'manager'
      ? 'руководитель'
      : role === 'employee'
        ? 'сотрудник'
        : (role as Role);
};

function toISOStringSafe(date?: string | Date | null): string | undefined {
  if (!date) return undefined;

  const parsed = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}

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
  role: roleFromDTO(role),
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
  role: role as Role,
  full_name: fullName,
  unit,
  position,
  telephone,
  email,
});

export const mapAuthUserFromDto = (dto: UserWithAuthDTO): UserWithAuth => ({
  id: dto.id,
  role: roleFromDTO(dto.role),
  fullName: dto.full_name,
  unit: dto.unit,
  position: dto.position,
  telephone: dto.telephone,
  email: dto.email,
  login: dto.login,
  password: dto.password,
});

export const preparingAuthUserDto = (dto: Partial<UserWithAuthDTO>): Partial<UserWithAuthDTO> => {
  const user = {
    ...dto,
    role: dto.role ? preparingRole(dto.role) : undefined,
  };
  return user;
};

export const mapFullUserFromDto = (dto: FullUserDTO): FullUser => ({
  id: dto.id,
  role: roleFromDTO(dto.role),
  fullName: dto.full_name,
  unit: dto.unit,
  position: dto.position,
  telephone: dto.telephone,
  email: dto.email,
  login: dto.login,
  password: dto.password,
  token: {
    jti: dto.token.jti,
    isBlacklisted: dto.token.is_blacklisted === 'true',
    createdAtFormatted: new Date(dto.token.created_at_formatted),
    expiresAtFormatted: new Date(dto.token.expires_at_formatted),
    tokenTimer: dto.token.token_timer,
  },
  lastLogin: new Date(dto.last_login),
  isActive: dto.is_active === 'true',
  isStaff: dto.is_staff === 'true',
});

export const mapFullUserToDto = (user: FullUser): FullUserDTO => ({
  id: user.id,
  role: user.role as Role,
  full_name: user.fullName,
  unit: user.unit,
  position: user.position,
  telephone: user.telephone,
  email: user.email,
  login: user.login,
  password: user.password,
  token: {
    jti: user.token.jti,
    is_blacklisted: user.token.isBlacklisted ? 'true' : 'false',
    created_at_formatted: toISOStringSafe(user.token.createdAtFormatted) ?? '',
    expires_at_formatted: toISOStringSafe(user.token.expiresAtFormatted) ?? '',
    token_timer: user.token.tokenTimer,
  },
  last_login: toISOStringSafe(user.lastLogin) ?? '',
  is_active: user.isActive ? 'true' : 'false',
  is_staff: user.isStaff ? 'true' : 'false',
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

export const mapCreateReportDataToDto = (data: CreateReportData): CreateReportDataDTO => ({
  dateRange: {
    from: toISOStringSafe(data.dateRange.from) ?? '',
    to: toISOStringSafe(data.dateRange.to) ?? '',
  },
  unit: data.unit,
  type: data.type,
  status: data.status,
});
