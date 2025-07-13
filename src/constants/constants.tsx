import { Column } from '@components/ui/Table';
import { Incident, IncidentType, TableIncident, User } from '@custom-types/types';
import { FilterDefinition, FilteredColumn } from '@components/ui/FilteredTable/FilteredTable';
import { FilterFunc } from '@utils/Filter';
import { ModalFilter } from '@components/ModalFilter';
import { Select } from '@components/ui/Select';

export const TABLE_PLACEHOLDER = '—';

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

const INCIDENT_TYPE_OPTIONS: readonly IncidentType[] = [
  'авария',
  'инцидент',
  'травма',
  'пожар',
  'другое',
] as const;

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
            options={INCIDENT_TYPE_OPTIONS}
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
    render: (incident) => new Date(incident.date).toLocaleDateString('ru-RU'),
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
          <Select
            value={value}
            options={['в работе', 'завершено', 'на рассмотрении']}
            onChange={onChange}
            placeholder={'- Любой -'}
          />
        )}
      </ModalFilter>
    ),
  },
];
