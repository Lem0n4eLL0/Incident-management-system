import { FullUser } from '@custom-types/types';
import { useSelector } from '@services/store';
import style from './ModalUser.module.css';
import clsx from 'clsx';
import staticStyle from '@style/common.module.css';
import fromStyle from '@style/form.module.css';
import { useState } from 'react';

type ModalUserProps = {
  user: FullUser;
  onClose: () => void;
};

export const ModalUser = ({ user, onClose }: ModalUserProps) => {
  const [isOpenDeleteWindow, setIsOpenDeletWindow] = useState(false);
  const [isUpdateModeEnabled, setIsUpdateModeEnabled] = useState(false);

  if (!user) {
    onClose();
    return null;
  }

  return (
    <>
      <div className={style.content}>
        {!isUpdateModeEnabled && (
          <span
            className={clsx(staticStyle.role, style.role, {
              [staticStyle.role_employee]: user.role === 'сотрудник',
              [staticStyle.role_manager]: user.role === 'руководитель',
              [staticStyle.role_admin]: user.role === 'администратор',
            })}
          >
            {user.role}
          </span>
        )}
        <h2 className={staticStyle.modal_title}>
          {isUpdateModeEnabled ? 'Изменение пользователя' : user.fullName}
        </h2>

        {isUpdateModeEnabled ? (
          <></>
        ) : (
          <div className={style.info}>
            <div className={style.parameters}>
              <div>
                <span className={style.field}>Подразделение:</span>
                <span>{user.unit}</span>
              </div>
              <div>
                <span className={style.field}>Должность:</span>
                <span>{user.position}</span>
              </div>
              <div>
                <span className={style.field}>Почта:</span>
                <span>{user.email}</span>
              </div>
              <div>
                <span className={style.field}>Телефон:</span>
                <span>{user.telephone}</span>
              </div>
              <div className={style.important}>
                <div>
                  <span className={style.field}>Логин:</span>
                  <span>{user.login}</span>
                </div>
                <div>
                  <span className={style.field}>Пароль:</span>
                  <span>{user.password}</span>
                </div>
                <div className={style.end_session}>
                  <span className={clsx(style.timer_title, style.field)}>
                    До завершения сеанса:
                  </span>
                  <span className={style.timer}>{user.token.tokenTimer}</span>
                  <button
                    type="button"
                    className={clsx(style.end_session_button)}
                    // onClick={}
                  >
                    завершить
                  </button>
                </div>
              </div>
            </div>
            <div className={style.footer}>
              <div className={style.controls}>
                <button
                  type="button"
                  className={clsx(fromStyle.confirm_button)}
                  onClick={() => setIsUpdateModeEnabled(true)}
                >
                  Изменить
                </button>
              </div>
              <div className={style.controls}>
                <button
                  type="button"
                  className={clsx(fromStyle.attention_button)}
                  onClick={() => setIsOpenDeletWindow(true)}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
