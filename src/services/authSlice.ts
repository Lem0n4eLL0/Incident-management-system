import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { ApiError, ApiLoginRequest } from '@custom-types/types';
import { checkAuthApi, loginUserApi, logoutUserApi } from '@api/userApi';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TAuthState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;

  errors: {
    authUserError?: ApiError;
    logoutUserError?: ApiError;
    authCheckError?: ApiError;
  };
  status: {
    isLoginPending: boolean;
    isLogoutPending: boolean;
    isAuthCheckPending: boolean;
  };
};

const initialState: TAuthState = {
  isAuthenticated: false,
  isAuthChecked: false,
  errors: {},
  status: {
    isLoginPending: false,
    isLogoutPending: false,
    isAuthCheckPending: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    checkAuth: create.asyncThunk(async () => await checkAuthApi(), {
      pending: (state) => {
        state.isAuthChecked = false;
        state.errors.authCheckError = undefined;
        state.status.isAuthCheckPending = true;
      },
      rejected: (state, action) => {
        state.errors.authCheckError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.status.isAuthCheckPending = false;
      },
      fulfilled: (state, action) => {
        state.isAuthChecked = true;
        state.status.isAuthCheckPending = false;
        state.isAuthenticated = action.payload.success;
        state.errors.authCheckError = undefined;
      },
    }),
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
          state.errors.authUserError = undefined;
        },
      }
    ),

    logoutUser: create.asyncThunk(async (id: string) => await logoutUserApi(id), {
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
        state.errors.logoutUserError = undefined;
      },
    }),
  }),
  selectors: {
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectStatus: (state) => state.status,
    selectErrors: (state) => state.errors,
  },
});

export const { loginUser, logoutUser, checkAuth } = authSlice.actions;
export const {
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectStatus: selectStatusAuth,
  selectErrors: selectErrorsAuth,
} = authSlice.selectors;

export const authReducer = authSlice.reducer;
