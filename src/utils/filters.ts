import { Incident } from '@custom-types/types';

export type IncidentFilter = (incident: Incident) => boolean;
