import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { ApiError, ApiLoginRequest } from '@custom-types/types';
import { loginUserApi, logoutUserApi } from '@api/userApi';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TAuthState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;

  errors: {
    authUserError?: ApiError;
    logoutUserError?: ApiError;
  };
  status: {
    isLoginPending: boolean;
    isLogoutPending: boolean;
  };
};

const initialState: TAuthState = {
  isAuthenticated: false,
  isAuthChecked: false,
  errors: {},
  status: {
    isLoginPending: false,
    isLogoutPending: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    loginUser: create.asyncThunk(
      async (loginData: ApiLoginRequest) => await loginUserApi(loginData),
      {
        pending: (state) => {
          state.isAuthenticated = false;
          state.errors.authUserError = undefined;
          state.status.isLoginPending = true;
        },
        rejected: (state, action) => {
          state.errors.authUserError = {
            code: action.error.code,
            message: action.error.message,
          };
          state.isAuthChecked = true;
          state.isAuthenticated = false;
          state.status.isLoginPending = false;
        },
        fulfilled: (state, action) => {
          state.isAuthChecked = true;
          state.status.isLoginPending = false;
          state.isAuthenticated = action.payload.success;
        },
      }
    ),

    logoutUser: create.asyncThunk(async () => await logoutUserApi(), {
      pending: (state) => {
        state.errors.logoutUserError = undefined;
        state.status.isLogoutPending = true;
      },
      rejected: (state, action) => {
        state.errors.logoutUserError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isLogoutPending = false;
      },
      fulfilled: (state) => {
        state.status.isLogoutPending = false;
      },
    }),
  }),
  selectors: {
    selectFlags: (state) => ({
      isAuthChecked: state.isAuthChecked,
      isAuthenticated: state.isAuthenticated,
    }),
    selectStatus: (state) => state.status,
    selectErrors: (state) => state.errors,
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export const {
  selectFlags: selectFlagsAuth,
  selectStatus: selectStatusAuth,
  selectErrors: selectErrorsAuth,
} = authSlice.selectors;

export const authReducer = authSlice.reducer;
