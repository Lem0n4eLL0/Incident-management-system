export type FilterFuncAny<T, K = any> = (item: T, value?: K) => boolean;
// export type FilterFunc<T, K extends keyof T> = (item: T, value?: T[K], another?: any) => boolean;
export type FilterFunc<T, K extends keyof T> = FilterFuncAny<T, T[K]>;

export type FilterFuncMap<T> = Partial<{ [K in keyof T]: FilterFunc<T, K> }>;

export class Filter<T> {
  private filters: FilterFuncMap<T>;

  constructor();
  constructor(filters: FilterFuncMap<T>);

  constructor(filters?: FilterFuncMap<T>) {
    this.filters = filters ?? {};
  }

  public set<K extends keyof T>(key: K, func: FilterFunc<T, K>) {
    this.filters[key] = func;
  }

  public remove<K extends keyof T>(key: K) {
    delete this.filters[key];
  }

  public apply(item: T): boolean {
    for (const key in this.filters) {
      const func = this.filters[key as keyof T];
      if (func && !func(item, item[key as keyof T])) {
        return false;
      }
    }
    return true;
  }

  public clear() {
    this.filters = {};
  }

  public isEmpty(): boolean {
    return Object.keys(this.filters).length === 0;
  }

  public getFilters() {
    return { ...this.filters };
  }
}
