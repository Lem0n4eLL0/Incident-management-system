import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@custom-types/types';

type UserState = {
  user: User | null; // добавить флаги авторизации
};

const initialState: UserState = {
  user: null,
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
  },
  selectors: {
    getUser: (state) => state.user,
  },
});

export const { changeUser } = userSlice.actions;
export const { getUser } = userSlice.selectors;
export const userReducer = userSlice.reducer;
