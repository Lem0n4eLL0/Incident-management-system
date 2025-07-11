import { Incident, User } from '@custom-types/types';

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

export const INCEDENTS: { incident: Incident[] } = {
  incident: [
    {
      id: '123',
      incidentNumber: '1',
      type: 'авария',
      date: new Date(),
      description: 'Тестовый инцедент',
      author: DEFAULT_USER.user,
      unit: '1 подразделение',
    },
    {
      id: '456',
      incidentNumber: '2',
      type: 'другое',
      date: new Date(),
      description: 'Тестовый инцедент 2',
      author: DEFAULT_USER.user,
      unit: '2 подразделение',
      status: 'завершено',
    },
    {
      id: '456756',
      incidentNumber: '3',
      type: 'авария',
      date: new Date(),
      description: 'Тестовый инцедент 3',
      author: DEFAULT_USER.user,
      unit: '3 подразделение',
      status: 'завершено',
    },
    {
      id: '456756',
      incidentNumber: '4',
      type: 'авария',
      date: new Date(),
      description: 'Тестовый инцедент 4',
      author: DEFAULT_USER.user,
      unit: '3 подразделение',
      status: 'в работе',
    },
    {
      id: '456756',
      incidentNumber: '5',
      type: 'авария',
      date: new Date(),
      description: 'Тестовый инцедент 5',
      author: DEFAULT_USER.user,
      unit: '3 подразделение',
      status: 'на рассмотрении',
    },
  ],
};
