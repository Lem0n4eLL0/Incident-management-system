import { mapUserToDto } from '@custom-types/mapperDTO';
import { Incident, IncidentDTO, User } from '@custom-types/types';

export const DEFAULT_USER: { user: User } = {
  user: {
    id: '1',
    role: 'сотрудник',
    fullName: 'Владислав Черванев',
    unit: 'Крутое',
    position: 'Вождь',
    telephone: '89456734566',
    email: 'zacrivskie@bk.ru',
  },
};

export const INCEDENTS: { incident: IncidentDTO[] } = {
  incident: [
    {
      id: '123',
      incident_number: '1',
      type: 'авария',
      date: '',
      description: 'Тестовый инцедент',
      author: mapUserToDto(DEFAULT_USER.user),
      unit: '1 подразделение',
    },
    {
      id: '456',
      incident_number: '2',
      type: 'другое',
      date: '',
      description: 'Тестовый инцедент 2',
      author: mapUserToDto(DEFAULT_USER.user),
      unit: '2 подразделение',
      status: 'завершено',
    },
    {
      id: '456756',
      incident_number: '3',
      type: 'авария',
      date: '',
      description: 'Тестовый инцедент 3',
      author: mapUserToDto(DEFAULT_USER.user),
      unit: '3 подразделение',
      status: 'завершено',
    },
    {
      id: '456756',
      incident_number: '4',
      type: 'авария',
      date: '',
      description: 'Тестовый инцедент 4',
      author: mapUserToDto(DEFAULT_USER.user),
      unit: '3 подразделение',
      status: 'в работе',
    },
    {
      id: '456756',
      incident_number: '5',
      type: 'авария',
      date: '',
      description: 'Тестовый инцедент 5',
      author: mapUserToDto(DEFAULT_USER.user),
      unit: '3 подразделение',
      status: 'на рассмотрении',
    },
  ],
};
