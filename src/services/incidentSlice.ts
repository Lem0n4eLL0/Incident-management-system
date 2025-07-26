import { addIncidentApi, deleteIncidentApi, getIncidentsApi, updateIncidentApi } from '@api/api';
import { mapIncidentFromDto } from '@custom-types/mapperDTO';
import { ApiError, Incident, IncidentDTO } from '@custom-types/types';
import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { logoutMeAuth } from './authSlice';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type IncidentsState = {
  incidents: Array<Incident>;
  status: {
    isGetIncidentsPending: boolean;
    isAddIncidentPending: boolean;
    isUpdateIncidentPending: boolean;
    isDeleteIncidentPending: boolean;
  };
  errors: {
    getIncidentsError?: ApiError;
    addIncidentError?: ApiError;
    updateIncidentError?: ApiError;
    deleteIncidentError?: ApiError;
  };
};

const initialState: IncidentsState = {
  incidents: [],
  status: {
    isGetIncidentsPending: false,
    isAddIncidentPending: false,
    isUpdateIncidentPending: false,
    isDeleteIncidentPending: false,
  },
  errors: {},
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: (create) => ({
    getIncidents: create.asyncThunk(async () => await getIncidentsApi(), {
      pending: (state) => {
        state.status.isGetIncidentsPending = true;
        state.errors.getIncidentsError = undefined;
      },
      rejected: (state, action) => {
        state.errors.getIncidentsError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isGetIncidentsPending = false;
      },
      fulfilled: (state, action) => {
        state.status.isGetIncidentsPending = false;
        state.incidents = action.payload.map((inc) => mapIncidentFromDto(inc));
      },
    }),

    addIncident: create.asyncThunk(
      async (incident: IncidentDTO) => await addIncidentApi(incident),
      {
        pending: (state) => {
          state.status.isAddIncidentPending = true;
          state.errors.addIncidentError = undefined;
        },
        rejected: (state, action) => {
          state.errors.addIncidentError = {
            code: action.error.code,
            message: action.error.message,
          };
          state.status.isAddIncidentPending = false;
        },
        fulfilled: (state, action) => {
          state.status.isAddIncidentPending = false;
          state.incidents.push(mapIncidentFromDto(action.payload));
        },
      }
    ),

    updateIncident: create.asyncThunk(
      async (incident: IncidentDTO) => await updateIncidentApi(incident),
      {
        pending: (state) => {
          state.status.isUpdateIncidentPending = true;
          state.errors.updateIncidentError = undefined;
        },
        rejected: (state, action) => {
          state.errors.updateIncidentError = {
            code: action.error.code,
            message: action.error.message,
          };
          state.status.isUpdateIncidentPending = false;
        },
        fulfilled: (state, action) => {
          state.status.isUpdateIncidentPending = false;
          const index = state.incidents.findIndex((i) => i.id === action.payload.id);
          if (index !== -1) {
            state.incidents[index] = mapIncidentFromDto(action.payload);
          }
        },
      }
    ),

    deleteIncident: create.asyncThunk(async (id: string) => await deleteIncidentApi(id), {
      pending: (state) => {
        state.status.isDeleteIncidentPending = true;
        state.errors.deleteIncidentError = undefined;
      },
      rejected: (state, action) => {
        console.log(action.error);
        state.errors.deleteIncidentError = {
          code: action.error.code,
          message: action.error.message,
        };
        state.status.isDeleteIncidentPending = false;
      },
      fulfilled: (state, action) => {
        state.status.isDeleteIncidentPending = false;
        const index = state.incidents.findIndex(
          (i) => i.id === mapIncidentFromDto(action.payload).id
        );
        if (index != -1) state.incidents.splice(index, 1);
      },
    }),

    clearDeleteIncidentError: create.reducer((state) => {
      state.errors.deleteIncidentError = undefined;
    }),
    clearErrors: create.reducer((state) => {
      state.errors = {};
    }),
  }),

  extraReducers: (builder) => {
    builder.addCase(logoutMeAuth, () => initialState);
  },

  selectors: {
    selectIncidents: (state) => state.incidents,
    selectErrors: (state) => state.errors,
    selectStatus: (state) => state.status,
  },
});

export const {
  getIncidents,
  addIncident,
  deleteIncident,
  updateIncident,
  clearDeleteIncidentError,
  clearErrors: clearErrorsIncident,
} = incidentsSlice.actions;
export const {
  selectIncidents,
  selectErrors: selectErrorsIncidents,
  selectStatus: selectStatusIncidents,
} = incidentsSlice.selectors;
export const incidentsReducer = incidentsSlice.reducer;
