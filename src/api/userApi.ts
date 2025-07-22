import { COOKIE_ACCESS_TOKEN_ALIAS, LOCAL_STORAGE_REFRESH_TOKEN_ALIAS } from '@constants/constants';
import { TEST_USER_DTO, TEST_FULL_USERS } from '@constants/test';
import { ApiLoginRequest, CreateUserDTO, FullUserDTO, User, UserDTO } from '@custom-types/types';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export const URL_API = process.env.REACT_APP_API_URL;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T = object> = T & {
  success: boolean;
};

export type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

/* Итоговые запросы на сервер */
export const refreshToken = (): Promise<TRefreshResponse> => {
  return fetch(`${URL_API}/api/auth/token/refresh/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_ALIAS),
    }),
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((res) => {
      if (!res.success) return Promise.reject(res);
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_ALIAS, res.refreshToken);
      Cookies.set(COOKIE_ACCESS_TOKEN_ALIAS, res.accessToken, { secure: true });
      return res;
    });
};

export const fetchWithRefresh = <T>(url: RequestInfo, options: RequestInit): Promise<T> => {
  return fetch(url, options)
    .then((res) => checkResponse<T>(res))
    .catch((err) => {
      if (err.code === 'TOKEN_EXPIRED')
        return refreshToken().then((refresh) => {
          if (options.headers) {
            (options.headers as { [key: string]: string }).authorization = refresh.accessToken;
          }
          return fetch(url, options).then((res) => checkResponse<T>(res));
        });
      else return Promise.reject(err);
    });
};

export const loginUserApi = (loginData: ApiLoginRequest): Promise<TRefreshResponse> => {
  return fetch(`${URL_API}/api/token/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(loginData),
  }).then((res) => {
    return checkResponse(res);
  });
};

export const getAuthUserApi = (): Promise<UserDTO> => {
  // авторизованный пользователь
  return fetchWithRefresh<UserDTO>(`${URL_API}/me/`, {
    method: HTTP_METHODS.GET,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const getUsersApi = (): Promise<Array<FullUserDTO>> => {
  return fetchWithRefresh<Array<FullUserDTO>>(`${URL_API}/api/users/`, {
    method: HTTP_METHODS.GET,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const createUserApi = (user: Partial<CreateUserDTO>): Promise<FullUserDTO> => {
  return fetchWithRefresh<FullUserDTO>(`${URL_API}/api/users/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(user),
  });
};

export const updateUserApi = (user: Partial<FullUserDTO>): Promise<FullUserDTO> => {
  return fetchWithRefresh<FullUserDTO>(`${URL_API}/api/users/`, {
    method: HTTP_METHODS.PATCH,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(user),
  });
};

export const deleteUsersApi = (id: string): Promise<FullUserDTO> => {
  return fetchWithRefresh<FullUserDTO>(`${URL_API}/api/users/${id}`, {
    method: HTTP_METHODS.DELETE,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const logoutUserApi = (id: string): Promise<TServerResponse> => {
  return fetchWithRefresh<TServerResponse>(`${URL_API}/logout_user/${id}`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const logoutAll = (): Promise<TServerResponse> => {
  return fetchWithRefresh<TServerResponse>(`${URL_API}/logout_user/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

/* Тестовые запросы с локальным хранилищем на клиенте */

// export const loginUserApi = (loginData: ApiLoginRequest) => {
//   return new Promise<TServerResponse>((res, rej) => {
//     if (loginData.login === 'err') rej('Неверные данные');
//     setTimeout(() => res({ success: true }), 300);
//   });
// };

// export const updateUserApi = (user: Partial<FullUserDTO>): Promise<FullUserDTO> => {
//   return new Promise((res, rej) => {
//     setTimeout(() => {
//       const index = TEST_FULL_USERS.findIndex((u) => u.id === user.id);
//       if (index !== -1) {
//         TEST_FULL_USERS[index] = {
//           ...TEST_FULL_USERS[index],
//           ...user,
//         };
//       }
//       // rej(new Error('error message'));
//       res(TEST_FULL_USERS[index]);
//     }, 1000);
//   });
// };

// export const createUserApi = (user: Partial<CreateUserDTO>) => {
//   return new Promise<FullUserDTO>((res, rej) => {
//     setTimeout(() => {
//       const newUser: FullUserDTO = {
//         id: uuidv4(),
//         full_name: user.full_name || '',
//         role: user.role || 'сотрудник',
//         unit: user.unit || '',
//         position: user.position || '',
//         telephone: user.telephone || '',
//         email: user.email || '',
//         login: user.login || '',
//         password: user.password || '',
//         token: {
//           jti: '',
//           is_blacklisted: 'false',
//           created_at_formatted: '',
//           expires_at_formatted: '',
//           token_timer: '',
//         },
//         last_login: '2025-07-21T10:30:45.000Z',
//         is_active: 'true',
//         is_staff: 'false',
//       };
//       //rej(new Error('Ошибка сервера'));
//       TEST_FULL_USERS.push(newUser);
//       res(newUser);
//     }, 1000);
//   });
// };

// export const deleteUsersApi = (id: string) => {
//   return new Promise<UserDTO>((res, rej) => {
//     setTimeout(() => {
//       // rej(new Error('error: User not found'));
//       const index = TEST_FULL_USERS.findIndex((u) => u.id === id);
//       if (index === -1) return rej(new Error('User not found'));

//       const deleted = TEST_FULL_USERS.splice(index, 1)[0];
//       res(deleted);
//     }, 500);
//   });
// };

// export const getUsersApi = () => {
//   return new Promise<Array<FullUserDTO>>((res) => {
//     setTimeout(() => res([...TEST_FULL_USERS]), 1000);
//   });
// };

// export const logoutUserApi = () => {
//   return new Promise((res) => res);
// };
