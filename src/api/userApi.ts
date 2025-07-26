import {
  LOCAL_STORAGE_ACCESS_TOKEN_ALIAS,
  LOCAL_STORAGE_REFRESH_TOKEN_ALIAS,
} from '@constants/constants';
import { TEST_USER_DTO, TEST_FULL_USERS } from '@constants/test';
import {
  ApiError,
  ApiLoginRequest,
  CreateReportDataDTO,
  CreateUserDTO,
  FullUserDTO,
  User,
  UserDTO,
} from '@custom-types/types';
import { logoutMeAuth } from '@services/authSlice';
import { store } from '@services/store';
import { v4 as uuidv4 } from 'uuid';

export const URL_API = process.env.REACT_APP_API_URL;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

type TServerResponse<T = object> = T & {
  success: boolean;
};

export type TRefreshResponse = TServerResponse<{
  refresh: string;
  access: string;
}>;

export type ResponseWithId = TServerResponse<{
  id: string;
}>;

const checkResponseWithErrorHandler = async <T>(res: Response): Promise<T> => {
  if (res.ok) return res.json();

  const errorBody = await res.json();
  const code = errorBody?.code || res.status;
  const message = Array.isArray(errorBody?.detail)
    ? errorBody.detail[0]
    : errorBody?.detail || 'Произошла ошибка';

  if (code === 'token_expired' || code === 'token_not_valid') {
    return Promise.reject({ code: 'token_expired', message });
  }

  // if (res.status >= 500) {
  //   window.location.href = '/error';
  //   return  Promise.reject();
  // }
  return Promise.reject({ code, message: `${message} ${code}` });
};

/* Итоговые запросы на сервер */
export const refreshToken = (): Promise<TRefreshResponse> => {
  return fetch(`${URL_API}/api/auth/token/refresh/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      refresh: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_ALIAS),
    }),
  })
    .then((res) => checkResponseWithErrorHandler<TRefreshResponse>(res))
    .then((res) => {
      if (!res.success) return Promise.reject(res);
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_ALIAS, res.access);
      return res;
    });
};

export const fetchWithRefresh = <T>(url: RequestInfo, options: RequestInit): Promise<T> => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_ALIAS);
  if (accessToken && options.headers) {
    (options.headers as { [key: string]: string }).Authorization = `Bearer ${accessToken}`;
  }

  return fetch(url, options)
    .then((res) => checkResponseWithErrorHandler<T>(res))
    .catch((err) => {
      if (err.code === 'token_expired') {
        return refreshToken()
          .then((refreshRes) => {
            if (options.headers) {
              (options.headers as { [key: string]: string }).Authorization =
                `Bearer ${refreshRes.access}`;
            }
            return fetch(url, options).then((res) => checkResponseWithErrorHandler<T>(res));
          })
          .catch((refreshErr) => {
            if (refreshErr.code === 'token_expired') {
              localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_ALIAS, '');
              localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_ALIAS, '');
              logoutMeAuth();
              window.location.reload();
            }
            return Promise.reject(refreshErr);
          });
      }
      return Promise.reject(err);
    });
};

export const checkAuthApi = async (): Promise<TServerResponse> => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_ALIAS);

  if (!accessToken) {
    return Promise.reject(new Error('No access token found'));
  }

  return fetch(`${URL_API}/api/auth/token/verify/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: accessToken,
    }),
  })
    .then(async (res) => {
      const action = await res.json();
      if (action.success) {
        return action;
      } else {
        return refreshToken().then(() => {
          return { success: true };
        });
      }
    })
    .catch((err) => {
      if (err.code === 'token_expired') {
        return Promise.resolve({ success: false });
      }
      return Promise.reject(err);
    });
};

export const loginUserApi = (loginData: ApiLoginRequest): Promise<TRefreshResponse> => {
  return fetch(`${URL_API}/api/auth/token/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(loginData),
  })
    .then((res) => checkResponseWithErrorHandler<TRefreshResponse>(res))
    .then((res) => {
      if (!res.success) return Promise.reject(res);
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_ALIAS, res.refresh);
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_ALIAS, res.access);
      return res;
    });
};

export const getAuthUserApi = (): Promise<UserDTO> => {
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
  return fetchWithRefresh<FullUserDTO>(`${URL_API}/api/users/${user.id}/`, {
    method: HTTP_METHODS.PATCH,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(user),
  });
};

export const deleteUsersApi = (id: string): Promise<FullUserDTO> => {
  return fetchWithRefresh<FullUserDTO>(`${URL_API}/soft_delete_user/${id}/`, {
    method: HTTP_METHODS.DELETE,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const logoutUserApi = (id: string): Promise<ResponseWithId> => {
  console.log(id);
  return fetchWithRefresh<ResponseWithId>(`${URL_API}/logout_user/${id}/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }).then((res) => ({ success: res.success, id: id }));
};

export const logoutAllUserApi = (): Promise<TServerResponse> => {
  return fetchWithRefresh<TServerResponse>(`${URL_API}/logout_all_users/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const createReportApi = async (body: CreateReportDataDTO): Promise<Blob> => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_ALIAS);
  const response = await fetch(`${URL_API}/api/incidents/analytics/report-xlsx/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw {
      code: response.status,
      message: error?.message || 'Ошибка при формировании отчета',
    };
  }

  return await response.blob();
};

/* Тестовые запросы с локальным хранилищем на клиенте */

// export const loginUserApi = (loginData: ApiLoginRequest) => {
//   return new Promise<TServerResponse>((res, rej) => {
//     if (loginData.login === 'err') rej('Неверные данные');
//     setTimeout(() => res({ success: true }), 300);
//   });
// };

// export const getAuthUserApi = (): Promise<UserDTO> => {
//   return new Promise((res) => {
//     setTimeout(() => {
//       res(TEST_USER_DTO);
//     }, 2000);
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

// export const logoutUserApi = (id: string) => {
//   return new Promise((res) => res);
// };
