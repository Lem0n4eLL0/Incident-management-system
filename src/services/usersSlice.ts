import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import {
  ApiError,
  ApiLoginRequest,
  CreateUserDTO,
  FullUser,
  UpdateUser,
  UpdateUserDTO,
  User,
  UserDTO,
} from '@custom-types/types';
import { EMPTY_USER } from '@constants/constants';
import { createUserApi, deleteUsersApi, logoutUserApi, updateUserApi } from '@api/userApi';
import {
  mapFullUserFromDto,
  mapUserFromDto,
  mapUserToDto,
  preparingAuthUserDto,
} from '@custom-types/mapperDTO';
import { getUsersApi } from '@api/userApi';
import { logoutMeAuth } from './authSlice';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TUserState = {
  users: FullUser[];
  isUsersGet: boolean;
  status: {
    isGetUsersPending: boolean;
    isCreateUserPending: boolean;
    isUpdateUserPending: boolean;
    isDeleteUserPending: boolean;
    isLogoutUserPending: boolean;
  };
  errors: {
    getUsersError?: ApiError;
    createUserError?: ApiError;
    deleteUserError?: ApiError;
    updateUserError?: ApiError;
    logoutUserError?: ApiError;
  };
};

const initialState: TUserState = {
  users: [],
  isUsersGet: false,
  status: {
    isGetUsersPending: false,
    isCreateUserPending: false,
    isUpdateUserPending: false,
    isDeleteUserPending: false,
    isLogoutUserPending: false,
  },
  errors: {},
};

const userSlice = createSlice({
  name: 'admin_users',
  initialState,
  reducers: (create) => ({
    getUsers: create.asyncThunk(async () => await getUsersApi(), {
      pending: (state) => {
        state.status.isGetUsersPending = true;
        state.isUsersGet = false;
        state.errors.getUsersError = undefined;
      },
      rejected: (state, action) => {
        state.errors.getUsersError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isGetUsersPending = false;
      },
      fulfilled: (state, action) => {
        state.users = action.payload.map((el) => mapFullUserFromDto(el));
        state.isUsersGet = true;
        state.errors.getUsersError = undefined;
        state.status.isGetUsersPending = false;
      },
    }),

    createUser: create.asyncThunk(
      async (user: CreateUserDTO) => await createUserApi(preparingAuthUserDto(user)),
      {
        pending: (state) => {
          state.status.isCreateUserPending = true;
          state.errors.createUserError = undefined;
        },
        rejected: (state, action) => {
          state.errors.createUserError = {
            code: action.error.code,
            message: action.error.message,
          };
          state.status.isCreateUserPending = false;
        },
        fulfilled: (state, action) => {
          state.users.push(mapFullUserFromDto(action.payload));
          state.errors.createUserError = undefined;
          state.status.isCreateUserPending = false;
        },
      }
    ),

    deleteUser: create.asyncThunk(async (id: string) => await deleteUsersApi(id), {
      pending: (state) => {
        state.status.isDeleteUserPending = true;
        state.errors.deleteUserError = undefined;
      },
      rejected: (state, action) => {
        state.errors.deleteUserError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isDeleteUserPending = false;
      },
      fulfilled: (state, action) => {
        state.users = state.users.filter((el) => el.id !== mapUserFromDto(action.payload).id);
        state.errors.deleteUserError = undefined;
        state.status.isDeleteUserPending = false;
      },
    }),

    updateUserFetch: create.asyncThunk(
      async (user: UpdateUserDTO) => await updateUserApi(preparingAuthUserDto(user)),
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
          const index = state.users.findIndex(
            (el) => el.id === mapFullUserFromDto(action.payload).id
          );
          if (index !== -1) {
            state.users[index] = mapFullUserFromDto(action.payload);
          }
          state.errors.updateUserError = undefined;
          state.status.isUpdateUserPending = false;
        },
      }
    ),

    logoutUser: create.asyncThunk(async (id: string) => await logoutUserApi(id), {
      pending: (state) => {
        state.status.isLogoutUserPending = true;
        state.errors.logoutUserError = undefined;
      },
      rejected: (state, action) => {
        state.errors.logoutUserError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isLogoutUserPending = false;
      },
      fulfilled: (state, action) => {
        const index = state.users.findIndex((el) => el.id === action.payload.id);
        console.log(action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            token: {
              ...state.users[index].token,
              tokenTimer: '',
            },
          };
        }
        state.errors.logoutUserError = undefined;
        state.status.isLogoutUserPending = false;
      },
    }),

    updateUser: create.reducer((state, action: PayloadAction<Partial<UpdateUser>>) => {
      const index = state.users.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = {
          ...state.users[index],
          ...action.payload,
        };
      }
    }),

    clearErrors: create.reducer((state) => {
      state.errors = {};
    }),
  }),
  extraReducers: (builder) => {
    builder.addCase(logoutMeAuth, (state) => initialState);
  },

  selectors: {
    selectUsers: (state) => state.users,
    selectIsUsersGet: (state) => state.isUsersGet,
    selectStatus: (state) => state.status,
    selectErrors: (state) => state.errors,
  },
});

export const {
  getUsers,
  createUser,
  deleteUser,
  logoutUser,
  updateUser: updateUserUsers,
  updateUserFetch: updateUserFetchUsers,
  clearErrors: clearErrorsUsers,
} = userSlice.actions;
export const {
  selectUsers,
  selectIsUsersGet,
  selectStatus: selectStatusUsers,
  selectErrors: selectErrorsUsers,
} = userSlice.selectors;

export const usersReducer = userSlice.reducer;
