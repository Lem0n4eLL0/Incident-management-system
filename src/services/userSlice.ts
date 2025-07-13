import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@custom-types/types';
import { EMPTY_USER } from '@constants/constants';
import { authenticationUser } from '@api/userApi';

type UserState = {
  isAuthentication: boolean;
  user: User | null; // добавить флаги авторизации
};

const initialState: UserState = {
  user: EMPTY_USER,
  isAuthentication: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        // временное решение до добавления поля авторизации
        Object.assign(state.user, action.payload);
      }
    },
    getUser: (state) => {
      authenticationUser().then((res) => (state.user = res));
    },
  },
  selectors: {
    selectUser: (state) => state.user,
  },
});

export const { changeUser, getUser } = userSlice.actions;
export const { selectUser } = userSlice.selectors;
export const userReducer = userSlice.reducer;
