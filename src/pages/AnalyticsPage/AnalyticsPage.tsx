import { Loader } from '@components/ui/Loader';
import style from './AnalyticsPage.module.css';
import staticStyle from '@style/common.module.css';
import formStyle from '@style/form.module.css';
import { Select } from '@components/ui/Select';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useSelector } from '@services/store';
import { selectIncidents } from '@services/incidentSlice';
import { Incident } from '@custom-types/types';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { Modal } from '@components/ui/Modal';
import { CreateReportForm } from '@components/forms/CreateReportForm';
import { CustomSelect } from '@components/ui/CustomSelect';

const CARTS_OPTIONS = ['По году', 'По типу', 'По подразделениям'] as const;
export const COLORS = [
  'var(--charts-100)',
  'var(--charts-200)',
  'var(--charts-300)',
  'var(--charts-400)',
  'var(--charts-500)',
  'var(--charts-600)',
  'var(--charts-700)',
  'var(--charts-800)',
  'var(--charts-900)',
  'var(--charts-1000)',
];

type CratsOptions = (typeof CARTS_OPTIONS)[number];

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

export const AnalyticsPage = () => {
  const [currentChart, setCurrentChart] = useState<CratsOptions>('По году');
  const chartsChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentChart(e.target.value as CratsOptions);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onYearValue, setOnYearValue] = useState<string>('2025');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const dataTypeChart = useMemo(() => transformByType(incidents), [incidents]);
  const dataDaysIncidentChart = useMemo(
    () => transformByMonth(incidents, onYearValue),
    [incidents, onYearValue]
  );
  const dataByUnitChart = useMemo(() => transByUnitChart(incidents), [incidents]);

  return (
    <div className={style.content}>
      <section className={style.charts}>
        <div className={style.controls}>
          <h2 className={style.select_title}>Выберите срез</h2>
          <Select<CratsOptions>
            options={['По году', 'По типу', 'По подразделениям']}
            onChange={chartsChangeHandler}
            value={currentChart}
            className={style.select}
          />
          <button
            className={clsx(formStyle.confirm_button, style.report_button)}
            onClick={() => setIsModalOpen(true)}
          >
            Сформировать отчет
          </button>
        </div>
        <div className={style.chart}>
          {currentChart === 'По типу' && (
            <>
              <div className={style.chart_header}>
                <h3 className={style.chart_title}>По типу происшествия</h3>
              </div>

              <div className={clsx(style.chart_wrapper, style.chart_wrapper_circle)}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataTypeChart}
                      dataKey="value"
                      activeShape={{ fill: 'var(--charts-hover)' }}
                    >
                      {dataTypeChart.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip wrapperClassName={style.tooltip} />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconSize={8}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          {currentChart === 'По году' && (
            <>
              <div className={style.chart_header}>
                <h3 className={style.chart_title}>Количество инцедентов по году</h3>
                <Select
                  value={onYearValue}
                  onChange={(e) => setOnYearValue(e.target.value)}
                  options={years}
                  className={clsx(formStyle.select, style.select_chart)}
                />
              </div>

              <div className={style.chart_wrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataDaysIncidentChart}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count">
                      {dataDaysIncidentChart.map((entry, index) => (
                        <Cell key={`cell-${entry.date}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          {currentChart === 'По подразделениям' && (
            <>
              <div className={style.chart_header}>
                <h3 className={style.chart_title}>По подразделениям</h3>
              </div>
              <div className={clsx(style.chart_wrapper, style.chart_justify_content_left)}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={dataByUnitChart}>
                    <XAxis type="number" allowDecimals={false} domain={[0, 'dataMax']} />
                    <YAxis
                      type="category"
                      dataKey="unit"
                      width={150}
                      tick={{ fontSize: 14 }}
                      domain={[0, 'dataMax']}
                    />
                    <Tooltip />
                    <Bar dataKey="count" barSize={20}>
                      {dataByUnitChart.map((entry, index) => (
                        <Cell key={`cell-${entry.unit}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </section>
      {isModalOpen && (
        <Modal contentClass={staticStyle.modal} onClose={() => setIsModalOpen(false)}>
          <CreateReportForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};
