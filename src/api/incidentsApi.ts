import { INCEDENTS } from '@constants/test';
import { Incident, IncidentDTO } from '@custom-types/types';
import { fetchWithRefresh, HTTP_METHODS, URL_API } from './userApi';

/* Итоговые запросы на сервер */

export const getIncidentsApi = (): Promise<Array<IncidentDTO>> => {
  return fetchWithRefresh<Array<IncidentDTO>>(`${URL_API}/api/incidents/items/`, {
    method: HTTP_METHODS.GET,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

export const addIncidentApi = (incident: IncidentDTO): Promise<IncidentDTO> => {
  return fetchWithRefresh<IncidentDTO>(`${URL_API}/api/incidents/items/`, {
    method: HTTP_METHODS.POST,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(incident),
  });
};

export const updateIncidentApi = (incident: Partial<IncidentDTO>): Promise<IncidentDTO> => {
  return fetchWithRefresh<IncidentDTO>(`${URL_API}/api/incidents/items/`, {
    method: HTTP_METHODS.PATCH,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(incident),
  });
};

export const deleteIncidentApi = (id: string): Promise<IncidentDTO> => {
  return fetchWithRefresh<IncidentDTO>(`${URL_API}/api/incidents/items/`, {
    method: HTTP_METHODS.DELETE,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
};

/* Тестовые запросы с локальным хранилищем на клиенте */

// export const getIncidentsApi = (): Promise<IncidentDTO[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(INCEDENTS.incident);
//     }, 1000);
//   });
// };

// export const addIncidentApi = (incident: IncidentDTO): Promise<IncidentDTO> => {
//   return new Promise((resolve, rej) => {
//     setTimeout(() => {
//       // rej(new Error('ошибка сервера'));
//       INCEDENTS.incident.push(incident);
//       resolve(incident);
//     }, 1000);
//   });
// };

// export const updateIncidentApi = (incident: IncidentDTO): Promise<IncidentDTO> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const index = INCEDENTS.incident.findIndex((i) => i.id === incident.id);
//       if (index !== -1) {
//         INCEDENTS.incident[index] = incident;
//         resolve(incident);
//       } else {
//         reject(new Error('Инцидент не найден'));
//       }
//     }, 2000);
//   });
// };

// export const deleteIncidentApi = (id: string): Promise<string> => {
//   return new Promise<string>((resolve, reject) => {
//     setTimeout(() => {
//       const index = INCEDENTS.incident.findIndex((i) => i.id === id);
//       if (index !== -1) {
//         INCEDENTS.incident.splice(index, 1);
//         resolve(id);
//       } else {
//         reject(new Error('Не удалось удалить: инцидент не найден'));
//       }
//     }, 500);
//   });
// };
