import { ApiLoginRequest, IncidentDTO, UserDTO } from '@custom-types/types';
import { TFormValidators } from '@hooks/useFormValidation';

function notEmptyField(value: string): boolean {
  return value.trim().length > 0;
}

function phoneValidator(value: string): boolean {
  return /^\+?[0-9\s\-()]{7,20}$/.test(value);
}

function emailValidator(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

export const getValidatableIncidentFields = (data: IncidentDTO) => {
  const { incident_number, type, date, description } = data;
  return { incident_number, type, date, description };
};

export const USER_VALIDATOR: Partial<TFormValidators<UserDTO>> = {
  telephone: {
    validator: phoneValidator,
    message: 'Неверный формат телефона',
  },
  email: {
    validator: emailValidator,
    message: 'Неверный формат почты',
  },
};

export const INCIDENT_VALIDATORS: Partial<TFormValidators<IncidentDTO>> = {
  incident_number: {
    validator: notEmptyField,
    message: 'Обязательно для заполнения',
  },
  type: {
    validator: notEmptyField,
    message: 'Обязательно для заполнения',
  },
  date: {
    validator: (value) => notEmptyField(value) && new Date(value).getTime() < new Date().getTime(),
    message: 'Неверный формат даты',
  },
  description: {
    validator: notEmptyField,
    message: 'Обязательно для заполнения',
  },
};

export const LOGIN_REQUEST_VALIDATORS: TFormValidators<ApiLoginRequest> = {
  login: {
    validator: notEmptyField,
    message: 'Обязательно для заполнения',
  },
  password: {
    validator: notEmptyField,
    message: 'Обязательно для заполнения',
  },
};
