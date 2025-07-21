import { combineReducers, combineSlices, configureStore, createStore } from '@reduxjs/toolkit';
import {
  createStoreHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';
import { userReducer } from './userSlice';
import { incidentsReducer } from './incidentSlice';
import { authReducer } from './authSlice';
import { usersReducer } from './usersSlice';

const rootRedusers = combineSlices({
  authReducer,
  userReducer,
  incidentsReducer,
  usersReducer,
});

const store = configureStore({
  reducer: rootRedusers,
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof rootRedusers>;

const useDispatch = dispatchHook.withTypes<AppDispatch>();
const useSelector = selectorHook.withTypes<RootState>();

export type { RootState, AppDispatch };
export { store, useDispatch, useSelector };
