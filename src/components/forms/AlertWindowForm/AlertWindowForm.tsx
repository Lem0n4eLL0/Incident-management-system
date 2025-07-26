import { Alert } from '@components/ui/Alert';
import style from './AlertWindowForm.module.css';
import staticStyle from '@style/common.module.css';
import fromStyle from '@style/form.module.css';
import clsx from 'clsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ApiError } from '@custom-types/types';

type AlertWindowFormProps = {
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
  title: string;
  isPending: boolean;
  buttonTitle?: string;
  serverError?: ApiError;
  alertClassName?: string;
};

export const AlertWindowForm = ({
  onSubmit,
  onClose,
  title,
  isPending,
  alertClassName,
  buttonTitle,
  serverError = { code: '', message: '' },
}: AlertWindowFormProps) => {
  const onCloseHandler = () => {
    if (!isPending) onClose();
  };

  return (
    <Alert className={alertClassName}>
      <div className={style.content}>
        <h1 className={style.title}>{title}</h1>
        <form className={style.form} onSubmit={onSubmit}>
          <div className={staticStyle.error}>{serverError?.message}</div>
          <div className={style.controls}>
            <button
              type="submit"
              className={clsx(fromStyle.attention_button, isPending && fromStyle.disabled)}
              disabled={isPending}
            >
              {isPending ? 'Процесс...' : (buttonTitle ?? 'Удалить')}
            </button>
            <button
              type="button"
              onClick={onCloseHandler}
              className={clsx(fromStyle.confirm_button, isPending && fromStyle.disabled)}
              disabled={isPending}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </Alert>
  );
};
