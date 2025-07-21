import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { ApiError, ApiLoginRequest, User, UserDTO } from '@custom-types/types';
import { EMPTY_USER } from '@constants/constants';
import {
  createUserApi,
  deleteUsersApi,
  getUserApi,
  loginUserApi,
  updateUserApi,
} from '@api/userApi';
import { mapUserFromDto, mapUserToDto } from '@custom-types/mapperDTO';
import { getUsersApi } from '@api/adminUsersApi';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TUserState = {
  users: User[];
  status: {
    isGetUsersPending: boolean;
    isCreateUserPending: boolean;
    isDeleteUserPending: boolean;
  };
  errors: {
    getUsersError?: ApiError;
    createUserError?: ApiError;
    deleteUserError?: ApiError;
  };
};

const initialState: TUserState = {
  users: [],
  status: {
    isGetUsersPending: false,
    isCreateUserPending: false,
    isDeleteUserPending: false,
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
        state.users = action.payload.map((el) => mapUserFromDto(el));
        state.status.isGetUsersPending = false;
      },
    }),

    createUser: create.asyncThunk(async (user: Partial<UserDTO>) => await createUserApi(user), {
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
        state.users.push(mapUserFromDto(action.payload));
        state.status.isCreateUserPending = false;
      },
    }),

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
        state.status.isDeleteUserPending = false;
      },
    }),

    updateUser: create.reducer((state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = {
          ...state.users[index],
          ...action.payload,
        };
      }
    }),
  }),

  selectors: {
    selectUsers: (state) => state.users,
    selectStatus: (state) => state.status,
    selectErrors: (state) => state.errors,
  },
});

export const { getUsers, createUser, deleteUser } = userSlice.actions;
export const {
  selectUsers,
  selectStatus: selectStatusUsers,
  selectErrors: selectErrorsUsers,
} = userSlice.selectors;

export const usersReducer = userSlice.reducer;
