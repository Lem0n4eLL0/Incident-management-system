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

export type UserWithAuth = User & {
  login: string;
  password: string;
};

export type UserWithAuthDTO = UserDTO & {
  login: string;
  password: string;
};

export type FullUser = UserWithAuth & {
  login: string;
  password: string;
  token: {
    jti: string;
    isBlacklisted: boolean;
    createdAtFormatted: Date;
    expiresAtFormatted: Date;
    tokenTimer: string; // ?
  };
  lastLogin: Date;
  isActive: boolean;
  isStaff: boolean;
};

export type FullUserDTO = UserWithAuthDTO & {
  token: {
    jti: string;
    is_blacklisted: boolean;
    created_at_formatted: string;
    expires_at_formatted: string;
    token_timer: string; // ?
  };
  last_login: string;
  is_active: boolean;
  is_staff: boolean;
};

export type CreateUser = UserWithAuth;
export type CreateUserDTO = UserWithAuthDTO;

export type UpdateUser = UserWithAuth;
export type UpdateUserDTO = UserWithAuthDTO;

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

export type TableIncident = Pick<Incident, 'incidentNumber' | 'type' | 'unit' | 'date' | 'status'>;
export type TableUsers = Pick<User, 'fullName' | 'unit' | 'position' | 'role'>;

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

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type CreateReportData = {
  dateRange: DateRange;
  unit?: string;
  type?: IncidentType;
  status?: IncidentStatus;
};

export type CreateReportDataDTO = {
  dateRange: {
    from: string;
    to: string;
  };
  unit?: string;
  type?: string;
  status?: string;
};

export type ApiError = {
  code: string | number | undefined;
  message: string | undefined;
};

export type ApiLoginRequest = {
  login: string;
  password: string;
};
