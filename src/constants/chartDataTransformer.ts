import { Incident } from '@custom-types/types';
import { format } from 'date-fns';

export type ChartDataPoint = Record<string, any>;

export type IncidentDataTransformer<T extends ChartDataPoint = ChartDataPoint> = (
  incidents: Incident[],
  option?: any
) => T[];

export const transformByType: IncidentDataTransformer<{ name: string; value: number }> = (
  incidents
) => {
  const result: Record<string, number> = {};

  incidents.forEach(({ type }) => {
    result[type] = (result[type] || 0) + 1;
  });

  return Object.entries(result).map(([name, value]) => ({ name, value }));
};

export const transformByMonth: IncidentDataTransformer<{ date: string; count: number }> = (
  incidents,
  year: string
) => {
  const result: Record<string, number> = {};

  for (let month = 1; month <= 12; month++) {
    const paddedMonth = String(month).padStart(2, '0');
    result[`${year}-${paddedMonth}`] = 0;
  }

  incidents.forEach(({ date }) => {
    const d = new Date(date);
    const incidentYear = format(d, 'yyyy');
    if (incidentYear === year) {
      const monthKey = format(d, 'yyyy-MM');
      result[monthKey] += 1;
    }
  });

  return Object.entries(result)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const transByUnitChart: IncidentDataTransformer<{ unit: string; count: number }> = (
  incidents
) => {
  const result: Record<string, number> = {};

  incidents.forEach(({ unit }) => {
    result[unit] = (result[unit] || 0) + 1;
  });

  return Object.entries(result).map(([unit, count]) => ({ unit, count }));
};
