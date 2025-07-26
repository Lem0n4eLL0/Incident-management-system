import { Filter, FilterFunc } from '@utils/Filter';
import { useCallback, useMemo, useRef, useState } from 'react';

export type FilterController<T> = {
  filteredData: Array<T>;
  setFilter: <K extends keyof T>(key: K, fn: FilterFunc<T, K>) => void;
  removeFilter: <K extends keyof T>(key: K) => void;
  clearFilters: () => void;
};

type useFilterProps<T> = {
  data: Array<T>;
};

export function useFilter<T>(props: useFilterProps<T>): FilterController<T> {
  const { data } = props;
  const [filters, setFilters] = useState<Filter<T>>(new Filter<T>());

  const setFilter = useCallback(<K extends keyof T>(key: K, func: FilterFunc<T, K>) => {
    setFilters((prev) => {
      const updated = new Filter<T>(prev.getFilters());
      updated.set(key, func);
      return updated;
    });
  }, []);

  const removeFilter = useCallback((key: keyof T) => {
    setFilters((prev) => {
      const updated = new Filter<T>(prev.getFilters());
      updated.remove(key);
      return updated;
    });
  }, []);

  const clearFilters = () => {
    setFilters(() => new Filter<T>());
  };

  const filteredData = useMemo(() => {
    const test = data.filter((item) => filters.apply(item));
    return test;
  }, [filters, data]);

  return {
    filteredData,
    setFilter,
    clearFilters,
    removeFilter,
  };
}
