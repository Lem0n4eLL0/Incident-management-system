import {
  Incident,
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  IncidentDTO,
  IncidentStatus,
  User,
} from '@custom-types/types';
import { FilteredColumn } from '@components/ui/FilteredTable/FilteredTable';
import { FilterFunc } from '@utils/Filter';
import { ModalFilter } from '@components/ModalFilter';
import { Select } from '@components/ui/Select';

export const TABLE_PLACEHOLDER = '—';
export const LOCAL_STORAGE_REFRESH_TOKEN_ALIAS = 'refreshToken';
export const COOKIE_ACCESS_TOKEN_ALIAS = 'accessToken';

const typeFilter: FilterFunc<Incident, 'type'> = (incident, value) => {
  return value ? incident.type === value : true;
};

const statusFilter: FilterFunc<Incident, 'status'> = (incident, value) => {
  return value ? incident.status === value : true;
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
  author: {
    id: '',
    role: '',
    full_name: '',
    unit: '',
    position: '',
    telephone: '',
    email: '',
  },
  status: '',
  measures_taken: '',
  responsible: '',
};

export const TABLE_COLUMNS: FilteredColumn<Incident>[] = [
  {
    key: 'incidentNumber',
    title: 'Номер',
  },
  {
    key: 'type',
    title: 'Тип',
    filterController: (controller) => (
      <ModalFilter<Incident, 'type'>
        controller={controller}
        column={'type'}
        filterFunc={typeFilter}
      >
        {({ value, onChange }) => (
          <Select
            value={value}
            options={INCIDENT_TYPES}
            onChange={onChange}
            placeholder={'- Любой -'}
          />
        )}
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
    filterController: (controller) => (
      <ModalFilter<Incident, 'status'>
        controller={controller}
        column={'status'}
        filterFunc={statusFilter}
      >
        {({ value, onChange }) => (
          <Select<IncidentStatus>
            value={value}
            options={INCIDENT_STATUSES}
            onChange={onChange}
            placeholder={'- Любой -'}
          />
        )}
      </ModalFilter>
    ),
  },
];
