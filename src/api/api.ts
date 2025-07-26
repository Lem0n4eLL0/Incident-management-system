import {
  LOCAL_STORAGE_ACCESS_TOKEN_ALIAS,
  LOCAL_STORAGE_REFRESH_TOKEN_ALIAS,
} from '@constants/constants';

import {
  ApiLoginRequest,
  CreateReportDataDTO,
  CreateUserDTO,
  FullUserDTO,
  IncidentDTO,
  UserDTO,
} from '@custom-types/types';
import { logoutMeAuth } from '@services/authSlice';

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

  if (res.status >= 500) {
    window.location.href = '/error';
    return Promise.reject();
  }
  return Promise.reject({ code, message: `${message} ${code}` });
};

/* Токены API */
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

/* Авотризация API*/

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

/* Пользователи API */
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

/* Отчет API */
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

/* Инциденты API */

export const getIncidentsApi = (): Promise<Array<IncidentDTO>> => {
  return fetchWithRefresh<Array<IncidentDTO>>(`${URL_API}/api/incidents/items/`, {
    method: HTTP_METHODS.GET,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const addIncidentApi = (incident: IncidentDTO): Promise<IncidentDTO> => {
  return fetchWithRefresh<IncidentDTO>(`${URL_API}/api/incidents/items/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(incident),
  });
};

export const updateIncidentApi = (incident: Partial<IncidentDTO>): Promise<IncidentDTO> => {
  return fetchWithRefresh<IncidentDTO>(`${URL_API}/api/incidents/items/${incident.id}/`, {
    method: HTTP_METHODS.PATCH,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(incident),
  });
};

export const deleteIncidentApi = (id: string): Promise<IncidentDTO> => {
  return fetchWithRefresh<IncidentDTO>(`${URL_API}/api/incidents/soft_delete_incident/${id}/`, {
    method: HTTP_METHODS.DELETE,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};
