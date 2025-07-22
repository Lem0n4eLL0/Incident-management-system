import { ApiError, FullUser } from '@custom-types/types';
import { useDispatch, useSelector } from '@services/store';
import style from './ModalUser.module.css';
import clsx from 'clsx';
import staticStyle from '@style/common.module.css';
import fromStyle from '@style/form.module.css';
import { FormEvent, useCallback, useState } from 'react';
import { UpdateUserForm } from '@components/forms/UpdateUserForm';
import { selectStatusUser, selectUser } from '@services/userSlice';
import { mapFullUserToDto } from '@custom-types/mapperDTO';
import { AlertWindowForm } from '@components/forms/AlertWindowForm';
import { deleteUser, selectErrorsUsers, selectStatusUsers } from '@services/usersSlice';

type ModalUserProps = {
  user: FullUser;
  onClose: () => void;
};

export const ModalUser = ({ user, onClose }: ModalUserProps) => {
  const dispatch = useDispatch();

  const userAuth = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const { isUpdateUserPending, isDeleteUserPending } = useSelector((state) =>
    selectStatusUsers.unwrapped(state.usersReducer)
  );
  const { deleteUserError } = useSelector((state) =>
    selectErrorsUsers.unwrapped(state.usersReducer)
  );

  const [isOpenDeleteWindow, setIsOpenDeletWindow] = useState(false);
  const [isUpdateModeEnabled, setIsUpdateModeEnabled] = useState(false);
  const [deleteUserServerError, setDeleteUserServerError] = useState<ApiError | undefined>(
    undefined
  );

  const onCloseUpdateModeHandler = useCallback(() => {
    if (!isUpdateUserPending) {
      setIsUpdateModeEnabled(false);
    }
  }, [isUpdateUserPending, setIsUpdateModeEnabled]);

  const isOpenDeletWindowHandler = useCallback(() => {
    if (!isDeleteUserPending) {
      setIsOpenDeletWindow(false);
      setDeleteUserServerError(undefined);
    }
  }, [isDeleteUserPending, setDeleteUserServerError]);

  const deleteUserHandler = async (e: FormEvent) => {
    e.preventDefault();
    setDeleteUserServerError(undefined);
    const action = await dispatch(deleteUser(user.id));
    if (deleteUser.rejected.match(action)) {
      setDeleteUserServerError({
        code: action.error.code,
        message: action.error.message || 'Произошла ошибка при удалении',
      });
    } else {
      isOpenDeletWindowHandler();
    }
  };

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
          <UpdateUserForm user={mapFullUserToDto(user)} onClose={onCloseUpdateModeHandler} />
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
              <div>
                <span className={style.field}>Логин:</span>
                <span>{user.login}</span>
              </div>
              <div>
                <span className={style.field}>Пароль:</span>
                <span>{user.password}</span>
              </div>
              <div className={style.end_session}>
                <span className={clsx(style.timer_title, style.field)}>До завершения сеанса:</span>
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
                  className={clsx(
                    fromStyle.attention_button,
                    user.id === userAuth?.id && fromStyle.disabled
                  )}
                  onClick={() => setIsOpenDeletWindow(true)}
                  disabled={user.id === userAuth?.id}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isOpenDeleteWindow && (
        <AlertWindowForm
          onSubmit={deleteUserHandler}
          onClose={isOpenDeletWindowHandler}
          title="Вы уверены?"
          isPending={isDeleteUserPending}
          serverError={deleteUserServerError}
          alertClassName={style.alert}
        />
      )}
    </>
  );
};
