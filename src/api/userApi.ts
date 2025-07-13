import { User } from '@custom-types/types';

const TEST_USER: User = {
  id: '1',
  role: 'сотрудник',
  fullName: 'Владислав Черванев',
  unit: 'Красный крест',
  position: 'превышает',
  telephone: '89456762343',
  email: 'zacrivgre@bk.ru',
};
export const authenticationUser = (): Promise<User> => {
  return new Promise<User>(() => TEST_USER);
};
