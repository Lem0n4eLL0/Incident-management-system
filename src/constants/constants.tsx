import {
  ApiError,
  CreateReportData,
  CreateUserDTO,
  Incident,
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  IncidentDTO,
  IncidentStatus,
  IncidentType,
  Role,
  User,
  USER_ROLES,
  UserDTO,
} from '@custom-types/types';
import { FilteredColumn } from '@ui/FilteredTable/FilteredTable';
import { ModalFilter } from '@components/ModalFilter';
import { CustomSelect } from '@ui/CustomSelect';
import { roleFilter, statusFilter, typeFilter } from './filters';
import { startOfYear } from 'date-fns';

export const TABLE_PLACEHOLDER = '—';
export const LOCAL_STORAGE_REFRESH_TOKEN_ALIAS = 'refreshToken';
export const LOCAL_STORAGE_ACCESS_TOKEN_ALIAS = 'accessToken';

export const ERROR_FORBIDDEN: ApiError = {
  code: 403,
  message: 'отказано в досупе',
};

export const EMPTY_USER: User = {
  id: '',
  role: 'сотрудник',
  fullName: '',
  unit: '',
  position: '',
  telephone: '',
  email: '',
};

export const EMPTY_USERDTO: UserDTO = {
  id: '',
  role: '',
  full_name: '',
  unit: '',
  position: '',
  telephone: '',
  email: '',
};
export const EMPTY_AUTH_USERDTO: CreateUserDTO = {
  ...EMPTY_USERDTO,
  login: '',
  password: '',
};

export const EMPTY_CREATE_USERDTO: CreateUserDTO = {
  ...EMPTY_AUTH_USERDTO,
};

export const EMPTY_UPDATE_USERDTO: CreateUserDTO = {
  ...EMPTY_AUTH_USERDTO,
};

export const EMPTY_INCIDENT: Incident = {
  id: '',
  incidentNumber: '',
  type: 'авария',
  date: new Date(),
  description: '',
  unit: '',
  author: EMPTY_USER,
  status: 'в работе',
  measuresTaken: '',
  responsible: '',
};

export const EMPTY_INCIDENTDTO: IncidentDTO = {
  id: '',
  incident_number: '',
  type: '',
  date: '',
  description: '',
  unit: '',
  author: EMPTY_USERDTO,
  status: '',
  measures_taken: '',
  responsible: '',
};

export const EMPTY_CREATE_REPOT_DATA: CreateReportData = {
  dateRange: {
    from: startOfYear(new Date()),
    to: new Date(),
  },
};

export const TABLE_USER_COLUMNS: FilteredColumn<User>[] = [
  {
    key: 'fullName',
    title: 'ФИО',
  },
  {
    key: 'unit',
    title: 'Подразделение',
  },
  {
    key: 'position',
    title: 'Должность',
  },
  {
    key: 'role',
    title: 'Роль',
    filterController: (newValue, onClose, onChange) => (
      <ModalFilter onClose={onClose}>
        <CustomSelect<Role>
          value={newValue}
          options={USER_ROLES}
          onChange={(value) => onChange(value, roleFilter)}
          onClose={onClose}
        />
      </ModalFilter>
    ),
  },
];

export const TABLE_INCIDENT_COLUMNS: FilteredColumn<Incident>[] = [
  {
    key: 'incidentNumber',
    title: 'Номер',
  },
  {
    key: 'type',
    title: 'Тип',
    filterController: (newValue, onClose, onChange) => (
      <ModalFilter onClose={onClose}>
        <CustomSelect<IncidentType>
          value={newValue}
          options={INCIDENT_TYPES}
          onChange={(value) => onChange(value, typeFilter)}
          onClose={onClose}
        />
      </ModalFilter>
    ),
  },
  { key: 'unit', title: 'Подразделение' },
  {
    key: 'date',
    title: 'Дата',
    render: (incident) =>
      incident.date ? new Date(incident.date).toLocaleDateString('ru-RU') : '',
  },
  {
    key: 'status',
    title: 'Статус',
    filterController: (newValue, onClose, onChange) => (
      <ModalFilter onClose={onClose}>
        <CustomSelect<IncidentStatus>
          value={newValue}
          options={INCIDENT_STATUSES}
          onChange={(value) => onChange(value, statusFilter)}
          onClose={onClose}
        />
      </ModalFilter>
    ),
  },
];

export const TABLE_REPORT_INCIDENT_COLUMNS: FilteredColumn<Incident>[] = [
  {
    key: 'incidentNumber',
    title: 'Номер',
  },
  {
    key: 'type',
    title: 'Тип',
  },
  {
    key: 'unit',
    title: 'Подразделение',
  },
  {
    key: 'date',
    title: 'Дата',
    render: (incident) =>
      incident.date ? new Date(incident.date).toLocaleDateString('ru-RU') : '',
  },
  {
    key: 'status',
    title: 'Статус',
  },
  {
    key: 'description',
    title: 'Описание',
  },
  {
    key: 'author',
    title: 'Aвтор',
    render: (incident) => (incident.author ? incident.author.fullName : ''),
  },
  {
    key: 'measuresTaken',
    title: 'Предпринятые меры',
  },
  {
    key: 'responsible',
    title: 'Ответственный',
  },
];

export const COLORS = [
  'var(--charts-100)',
  'var(--charts-200)',
  'var(--charts-300)',
  'var(--charts-400)',
  'var(--charts-500)',
  'var(--charts-600)',
  'var(--charts-700)',
  'var(--charts-800)',
  'var(--charts-900)',
  'var(--charts-1000)',
];
