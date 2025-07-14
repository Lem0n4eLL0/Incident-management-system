import { useState } from 'react';

export type TFieldType<T> = {
  field: keyof T;
  value: string;
};

export type TFormValidators<T> = {
  [key in keyof T]: {
    validator: (value: string) => boolean;
    message: string;
  };
};

export type TValidationErrors<T> = {
  [key in keyof T]?: string;
};

export function useFormValidation<T>(validators: Partial<TFormValidators<T>>) {
  const [errors, setErrors] = useState<TValidationErrors<T>>({});
  const validateField = (validatedField: TFieldType<T>): boolean => {
    const { field, value } = validatedField;
    const validator = validators[field];
    if (validator) {
      const isValid = validator.validator(value);
      setErrors((prev) => ({ ...prev, [field]: isValid ? undefined : validator.message }));
      return isValid;
    }
    return true;
  };

  const validateAll = (formData: Partial<Record<keyof T, string>>): boolean => {
    let isValid = true;
    const newErrors: TValidationErrors<T> = {};

    for (const field in validators) {
      const validator = validators[field];
      if (validator && !validator.validator(formData[field] || '')) {
        newErrors[field] = validator.message;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const isAllValid = (formData: Partial<Record<keyof T, string>>): boolean => {
    for (const field in validators) {
      const validator = validators[field];
      if (validator && !validator.validator(formData[field] || '')) {
        return false;
      }
    }
    return true;
  };

  return {
    errors,
    isAllValid,
    validateField,
    validateAll,
  };
}
