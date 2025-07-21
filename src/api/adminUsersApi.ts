import { TEST_FULL_USERS } from '@constants/test';
import { FullUserDTO } from '@custom-types/types';

export const getUsersApi = () => {
  return new Promise<Array<FullUserDTO>>((res) => {
    setTimeout(() => res([...TEST_FULL_USERS]), 1000);
  });
};
