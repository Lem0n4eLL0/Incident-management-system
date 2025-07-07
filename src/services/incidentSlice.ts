import {
  addIncidentApi,
  deleteIncidentApi,
  getIncidentsApi,
  updateIncidentApi,
} from '@api/incidentsApi';
import { Incident } from '@custom-types/types';
import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type Operation = 'fetch' | 'add' | 'update' | 'delete' | null;
type IncidentsState = {
  incidents: Array<Incident>;
  currentOperation: Operation;
  error: string | null;
};

const initialState: IncidentsState = {
  incidents: [],
  currentOperation: null,
  error: null,
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: (create) => ({
    getIncidents: create.asyncThunk(async () => await getIncidentsApi(), {
      pending: (state) => {
        state.currentOperation = 'fetch';
        state.error = null;
      },
      rejected: (state, action) => {
        state.currentOperation = null;
        state.error = action.error.message || 'Ошибка загрузки';
      },
      fulfilled: (state, action) => {
        state.currentOperation = null;
        state.incidents = action.payload;
      },
    }),

    addIncident: create.asyncThunk(async (incident: Incident) => await addIncidentApi(incident), {
      pending: (state) => {
        state.currentOperation = 'add';
        state.error = null;
      },
      rejected: (state, action) => {
        state.currentOperation = null;
        state.error = action.error.message || 'Ошибка добавления';
      },
      fulfilled: (state, action) => {
        state.currentOperation = null;
        state.incidents.push(action.payload);
      },
    }),

    updateIncident: create.asyncThunk(
      async (incident: Incident) => await updateIncidentApi(incident),
      {
        pending: (state) => {
          state.currentOperation = 'update';
          state.error = null;
        },
        rejected: (state, action) => {
          state.currentOperation = null;
          state.error = action.error.message || 'Ошибка обновления';
        },
        fulfilled: (state, action) => {
          state.currentOperation = null;
          const index = state.incidents.findIndex((i) => i.id === action.payload.id);
          if (index !== -1) {
            state.incidents[index] = action.payload;
          }
        },
      }
    ),

    deleteIncident: create.asyncThunk(async (id: string) => await deleteIncidentApi(id), {
      pending: (state) => {
        state.currentOperation = 'delete';
        state.error = null;
      },
      rejected: (state, action) => {
        state.currentOperation = null;
        state.error = action.error.message || 'Ошибка удаления';
      },
      fulfilled: (state, action) => {
        state.currentOperation = null;
        state.incidents = state.incidents.filter((i) => i.id !== action.payload);
      },
    }),
  }),

  selectors: {
    selectIncidents: (state) => state.incidents,
    selectTotal: (state) => state.incidents.length,
    selectError: (state) => state.error,
    selectCurrentOperation: (state) => state.currentOperation,
  },
});

export const { getIncidents, addIncident, deleteIncident, updateIncident } = incidentsSlice.actions;
export const { selectIncidents, selectTotal, selectError, selectCurrentOperation } =
  incidentsSlice.selectors;
export const incidentsReducer = incidentsSlice.reducer;
