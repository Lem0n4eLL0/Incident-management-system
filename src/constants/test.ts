import { mapUserToDto } from '@custom-types/mapperDTO';
import { Incident, IncidentDTO, User, UserDTO } from '@custom-types/types';

export const TEST_USER_DTO: UserDTO = {
  id: '1',
  role: 'сотрудник',
  full_name: 'Владислав Черванев',
  unit: 'Красный крест',
  position: 'превышает',
  telephone: '89456762343',
  email: 'zacrivgre@bk.ru',
};

export const INCEDENTS: { incident: IncidentDTO[] } = {
  incident: [
    {
      id: '123',
      incident_number: '1',
      type: 'авария',
      date: '2020-02-10T00:00:00.000Z',
      description: 'Тестовый инцедент',
      author: TEST_USER_DTO,
      unit: TEST_USER_DTO.unit,
      measures_taken: 'test test',
      status: 'завершено',
    },
    {
      id: '456',
      incident_number: '2',
      type: 'другое',
      date: '2020-02-10T00:00:00.000Z',
      description: 'Тестовый инцедент 2',
      author: TEST_USER_DTO,
      unit: TEST_USER_DTO.unit,
      status: 'завершено',
      measures_taken: 'test test',
    },
    {
      id: '456756',
      incident_number: '3',
      type: 'авария',
      date: '2020-02-10T00:00:00.000Z',
      description: 'Тестовый инцедент 3',
      author: TEST_USER_DTO,
      unit: TEST_USER_DTO.unit,
      status: 'завершено',
    },
    {
      id: '456756',
      incident_number: '4',
      type: 'авария',
      date: '2020-02-10T00:00:00.000Z',
      description: 'Тестовый инцедент 4',
      author: TEST_USER_DTO,
      unit: TEST_USER_DTO.unit,
      status: 'в работе',
    },
    {
      id: '456756',
      incident_number: '5',
      type: 'авария',
      date: '2020-02-10T00:00:00.000Z',
      description: 'Тестовый инцедент 5',
      author: TEST_USER_DTO,
      unit: TEST_USER_DTO.unit,
      status: 'на рассмотрении',
    },
  ],
};
