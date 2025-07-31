import { ApiError, CreateReportData } from '@custom-types/types';
import { Navigate, useLocation } from 'react-router-dom';
import style from './CreateReportPage.module.css';
import staticStyle from '@style/common.module.css';
import { FormEvent, useEffect, useState } from 'react';
import { FilteredTable } from '@components/ui/FilteredTable';
import formStyle from '@style/form.module.css';
import { selectIncidents } from '@services/incidentSlice';
import { useSelector } from '@services/store';
import { useFilter } from '@hooks/useFilter';
import { TABLE_REPORT_INCIDENT_COLUMNS } from '@constants/constants';
import { format } from 'date-fns';
import { createReportApi } from '@api/api';
import { mapCreateReportDataToDto } from '@custom-types/mapperDTO';
import { filterByDateRange, statusFilter, typeFilter, unitfilter } from '@constants/filters';

export const CreateReportPage = () => {
  const location = useLocation();
  const reportData = location.state?.reportData as CreateReportData;
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const filter = useFilter({ data: incidents });
  const [serverError, setServerError] = useState<ApiError | null>(null);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    try {
      const blob = await createReportApi(mapCreateReportDataToDto(reportData));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setServerError({
        code: err.code || 500,
        message: err.message || 'Неизвестная ошибка',
      });
    }
  };

  useEffect(() => {
    if (reportData) {
      filter.setFilter('date', (item) => filterByDateRange(item, reportData.dateRange));
      filter.setFilter('unit', (item) => unitfilter(item, reportData.unit));
      filter.setFilter('type', (item) => typeFilter(item, reportData.type));
      filter.setFilter('status', (item) => statusFilter(item, reportData.status));
    }
  }, [reportData]);

  if (!reportData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={style.content}>
      <div className={style.report}>
        <div className={style.report_info}>
          <div className={style.info}>
            <div className={style.filter}>
              <span className={style.filter_title}>Дата</span>
              {`C ${format(reportData.dateRange.from!, 'yyyy-MM-dd')}, по ${format(reportData.dateRange.to!, 'yyyy-MM-dd')}`}
            </div>
            <div className={style.filter}>
              <span className={style.filter_title}>Подразделение</span>
              {reportData.unit ?? 'Все'}
            </div>
            <div className={style.filter}>
              <span className={style.filter_title}>Статус</span>
              {reportData.status ?? 'Все'}
            </div>
            <div className={style.filter}>
              <span className={style.filter_title}>Тип</span>
              {reportData.type ?? 'Все'}
            </div>
            <span className={staticStyle.error}>{serverError?.message}</span>
          </div>
          <form onSubmit={submitHandler}>
            <button type="submit" className={formStyle.confirm_button}>
              Сформировать
            </button>
          </form>
        </div>
        <FilteredTable
          filter={filter}
          columns={TABLE_REPORT_INCIDENT_COLUMNS}
          caption="Инцеденты вошедшие в отчет"
        />
      </div>
    </div>
  );
};
