import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { ApiError, User, UserDTO } from '@custom-types/types';
import { EMPTY_USER } from '@constants/constants';
import { getUserApi, loginUserApi } from '@api/userApi';
import { mapUserFromDto } from '@custom-types/mapperDTO';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: User | null;
  loginUserError: ApiError | undefined;
  loginUserRequest: boolean;
};

const initialState: TUserState = {
  user: EMPTY_USER,
  isAuthenticated: false,
  isAuthChecked: false,
  loginUserError: undefined,
  loginUserRequest: false,
};

export type TLoginUser = {
  login: string;
  password: string;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    loginUser: create.asyncThunk(async (loginData: TLoginUser) => await loginUserApi(loginData), {
      pending: (state) => {
        state.loginUserRequest = true;
        state.isAuthenticated = false;
        state.loginUserError = undefined;
      },
      rejected: (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = {
          code: action.error.code ?? -1,
          message: action.error.message ?? 'Неизвестная ошибка',
        };
        state.isAuthChecked = true;
      },
      fulfilled: (state, action) => {
        state.user = mapUserFromDto(action.payload);
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      },
    }),

    getUser: create.asyncThunk(async () => await getUserApi(), {
      pending: (state) => {
        state.loginUserRequest = true;
        state.isAuthenticated = false;
        state.loginUserError = undefined;
      },
      rejected: (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = {
          code: action.error.code ?? -1,
          message: action.error.message ?? 'Неизвестная ошибка',
        };
        state.isAuthChecked = true;
      },
      fulfilled: (state, action) => {
        state.user = mapUserFromDto(action.payload);
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      },
    }),
  }),
  selectors: {
    selectUser: (state) => state.user,
    selectAll: (state) => state,
  },
});

export const { loginUser, getUser } = userSlice.actions;
export const { selectUser, selectAll } = userSlice.selectors;
export const userReducer = userSlice.reducer;
