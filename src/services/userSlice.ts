import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { ApiError, ApiLoginRequest, User, UserDTO } from '@custom-types/types';
import { EMPTY_USER } from '@constants/constants';
import { getUserApi, loginUserApi, updateUserApi } from '@api/userApi';
import { mapUserFromDto, mapUserToDto } from '@custom-types/mapperDTO';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TUserState = {
  user: User | null;
  status: {
    isGetUserPending: boolean;
    isUpdateUserPending: boolean;
  };
  errors: {
    getUserError?: ApiError;
    updateUserError?: ApiError;
  };
};

const initialState: TUserState = {
  user: EMPTY_USER,
  status: {
    isGetUserPending: false,
    isUpdateUserPending: false,
  },
  errors: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    getUser: create.asyncThunk(async () => await getUserApi(), {
      pending: (state) => {
        state.status.isGetUserPending = true;
        state.errors.getUserError = undefined;
      },
      rejected: (state, action) => {
        state.errors.getUserError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isGetUserPending = false;
      },
      fulfilled: (state, action) => {
        state.user = mapUserFromDto(action.payload);
        state.status.isGetUserPending = false;
      },
    }),
    updateUser: create.asyncThunk(async (user: Partial<UserDTO>) => await updateUserApi(user), {
      pending: (state) => {
        state.status.isUpdateUserPending = true;
        state.errors.updateUserError = undefined;
      },
      rejected: (state, action) => {
        state.errors.updateUserError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isUpdateUserPending = false;
      },
      fulfilled: (state, action) => {
        state.user = mapUserFromDto(action.payload);
        state.status.isUpdateUserPending = false;
      },
    }),
  }),
  selectors: {
    selectUser: (state) => state.user,
    selectStatus: (state) => state.status,
    selectErrors: (state) => state.errors,
  },
});

export const { getUser, updateUser } = userSlice.actions;
export const {
  selectUser,
  selectStatus: selectStatusUser,
  selectErrors: selectErrorsUser,
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
