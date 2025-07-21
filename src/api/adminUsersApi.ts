import { TEST_USERS } from '@constants/test';
import { UserDTO } from '@custom-types/types';

export const getUsersApi = () => {
  return new Promise<Array<UserDTO>>((res) => {
    setTimeout(() => res([...TEST_USERS]), 500);
  });
};
