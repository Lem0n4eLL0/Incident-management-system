import { combineReducers, configureStore, createStore } from '@reduxjs/toolkit';
import {
  createStoreHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';
import { userReducer } from '@services/userSlice';
const rootRedusers = combineReducers({
  userReducer,
});

const store = configureStore({
  reducer: rootRedusers,
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof rootRedusers>;

const useDispatch = dispatchHook.withTypes<AppDispatch>();
const useSelector = selectorHook.withTypes<RootState>();

export { store, useDispatch, useSelector };
