import { asyncThunkCreator, buildCreateSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiError, User, UserDTO } from '@custom-types/types';
import { getAuthUserApi, updateUserApi } from '@api/api';
import { mapUserFromDto, preparingAuthUserDto } from '@custom-types/mapperDTO';
import { logoutMeAuth } from './authSlice';

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
  user: null,
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
    getUser: create.asyncThunk(async () => await getAuthUserApi(), {
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
        state.errors.getUserError = undefined;
        state.status.isGetUserPending = false;
      },
    }),

    updateUserFetch: create.asyncThunk(
      async (user: Partial<UserDTO>) => await updateUserApi(preparingAuthUserDto(user)),
      {
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
          state.errors.updateUserError = undefined;
          state.status.isUpdateUserPending = false;
        },
      }
    ),
    updateUser: create.reducer((state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }),
  }),
  extraReducers: (builder) => {
    builder.addCase(logoutMeAuth, () => initialState);
  },
  selectors: {
    selectUser: (state) => state.user,
    selectStatus: (state) => state.status,
    selectErrors: (state) => state.errors,
  },
});

export const {
  getUser,
  updateUser: updateUserUser,
  updateUserFetch: updateUserFetchUser,
} = userSlice.actions;
export const {
  selectUser,
  selectStatus: selectStatusUser,
  selectErrors: selectErrorsUser,
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
