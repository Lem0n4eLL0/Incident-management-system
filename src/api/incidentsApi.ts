import { INCEDENTS } from '@constants/test';
import { Incident } from '@custom-types/types';

export const getIncidentsApi = (): Promise<Incident[]> => {
  return new Promise<Incident[]>((resolve) => {
    setTimeout(() => {
      resolve(INCEDENTS.incident);
    }, 1000);
  });
};

export const addIncidentApi = (incident: Incident): Promise<Incident> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      INCEDENTS.incident.push(incident);
      resolve(incident);
    }, 500);
  });
};

export const updateIncidentApi = (incident: Incident): Promise<Incident> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = INCEDENTS.incident.findIndex((i) => i.id === incident.id);
      if (index !== -1) {
        INCEDENTS.incident[index] = incident;
        resolve(incident);
      } else {
        reject(new Error('Инцидент не найден'));
      }
    }, 500);
  });
};

export const deleteIncidentApi = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = INCEDENTS.incident.findIndex((i) => i.id === id);
      if (index !== -1) {
        INCEDENTS.incident.splice(index, 1);
        resolve(id);
      } else {
        reject(new Error('Не удалось удалить: инцидент не найден'));
      }
    }, 500);
  });
};
