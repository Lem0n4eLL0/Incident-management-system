type SelectProps<T> = {
  onChange: (value: T | undefined) => void;
  options: readonly T[];
  value?: T;
  placeholder?: string;
};

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: SelectProps<T>) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? undefined : (v as T));
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
