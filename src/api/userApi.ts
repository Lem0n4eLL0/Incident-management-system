import { COOKIE_ACCESS_TOKEN_ALIAS, LOCAL_STORAGE_REFRESH_TOKEN_ALIAS } from '@constants/constants';
import { TEST_USER_DTO } from '@constants/test';
import { ApiLoginRequest, User, UserDTO } from '@custom-types/types';
import Cookies from 'js-cookie';

const URL_API = process.env.REACT_APP_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T = object> = T & {
  success: boolean;
};

export type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> => {
  return fetch(`${URL_API}/api/auth/token`, {
    method: 'POST',
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

export const loginUserApi = (loginData: ApiLoginRequest) => {
  return new Promise<TServerResponse>((res, rej) => {
    if (loginData.login === 'err') rej('Неверные данные');
    setTimeout(() => res({ success: true }), 300);
  });
};

export const logoutUserApi = () => {
  return new Promise((res) => res);
};

export const getUserApi = () => {
  return new Promise<UserDTO>((res) => {
    setTimeout(() => res(TEST_USER_DTO), 1000);
  });
};
