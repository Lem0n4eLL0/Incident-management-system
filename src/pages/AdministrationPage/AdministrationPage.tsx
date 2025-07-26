import { useDispatch, useSelector } from '@services/store';
import {
  clearErrorsUsers,
  getUsers,
  logoutAllUsers,
  selectErrorsUsers,
  selectIsUsersGet,
  selectStatusUsers,
  selectUsers,
} from '@services/usersSlice';
import style from './AdministrationPage.module.css';
import staticStyle from '@style/common.module.css';
import formStyle from '@style/form.module.css';
import { Loader } from '@components/ui/Loader';
import { FormEvent, useCallback, useEffect, useReducer, useState } from 'react';
import clsx from 'clsx';
import { FilteredTable } from '@components/ui/FilteredTable';
import { User } from '@custom-types/types';
import { fullNameFilter, TABLE_PLACEHOLDER, TABLE_USER_COLUMNS } from '@constants/constants';
import { Table } from '@components/ui/Table';
import { useFilter } from '@hooks/useFilter';
import { Modal } from '@components/ui/Modal';
import { selectStatusUser } from '@services/userSlice';
import { AddIncidentForm } from '@components/forms/AddIncidentForm';
import { AddUserForm } from '@components/forms/AddUserForm';
import { ModalUser } from '@components/ModalUser';
import { Alert } from '@components/ui/Alert';
import { AlertWindowForm } from '@components/forms/AlertWindowForm';
export const AdministrationPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => selectUsers.unwrapped(state.usersReducer));
  const { logoutAllUserError } = useSelector((state) =>
    selectErrorsUsers.unwrapped(state.usersReducer)
  );
  const {
    isCreateUserPending,
    isUpdateUserPending,
    isDeleteUserPending,
    isGetUsersPending,
    isLogoutAllUserPending,
  } = useSelector((state) => selectStatusUsers.unwrapped(state.usersReducer));
  const isUsersGet = useSelector((state) => selectIsUsersGet.unwrapped(state.usersReducer));

  const filter = useFilter<User>({ data: users });
  const [searchValue, searchHandler] = useReducer(
    (_: string, e: React.ChangeEvent<HTMLInputElement>) => e.target.value,
    ''
  );
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenModalUser, setIsOpenModalUser] = useState(false);
  const [isOpenLogoutAll, setIsOpenLogoutAll] = useState(false);

  useEffect(() => {
    if (!isUsersGet) dispatch(getUsers());
  }, [dispatch, isUsersGet]);

  useEffect(() => {
    filter.setFilter('fullName', (item) => fullNameFilter(item, searchValue));
  }, [searchValue]);

  const closeAddUserModalHandler = useCallback(() => {
    if (!isCreateUserPending) {
      setIsOpenAddUser(false);
      dispatch(clearErrorsUsers());
    }
  }, [isCreateUserPending, setIsOpenAddUser]);

  const closeUserModalHandler = (callback: () => void) => {
    if (!isUpdateUserPending && !isDeleteUserPending) {
      setIsOpenModalUser(false);
      callback();
    }
  };

  const logoutAllUserHandler = (e: FormEvent) => {
    e.preventDefault();
    dispatch(logoutAllUsers());
  };

  if (isGetUsersPending) {
    return (
      <div className={style.content}>
        <section className={style.users}>
          <Loader loaderClass={staticStyle.loader_bg} isAbsolute></Loader>
        </section>
      </div>
    );
  }

  return (
    <div className={style.content}>
      <section className={style.users}>
        <div className={style.controls}>
          <input
            type="search"
            className={style.search}
            name="search"
            placeholder="Поиск..."
            onChange={searchHandler}
          ></input>
          <div className={style.buttons}>
            <button
              type="button"
              className={clsx(formStyle.confirm_button, style.add_user_button)}
              onClick={() => setIsOpenAddUser(true)}
            >
              Добавить
            </button>
            <button
              type="button"
              className={clsx(formStyle.attention_button, style.logout_all_button)}
              onClick={() => setIsOpenLogoutAll(true)}
            >
              Завершить
            </button>
          </div>
        </div>
        <FilteredTable<User>
          columns={TABLE_USER_COLUMNS}
          filter={filter}
          placeholder={TABLE_PLACEHOLDER}
          caption={'Пользователи в системе'}
          modal={{
            openHandler: () => setIsOpenModalUser(true),
            isOpen: isOpenModalUser,
            renderModal: (id, onClose) => (
              <Modal
                contentClass={staticStyle.modal}
                onClose={() => closeUserModalHandler(onClose)}
              >
                <ModalUser user={users.find((el) => el.id === id)!} onClose={onClose} />
              </Modal>
            ),
          }}
        />
      </section>
      {isOpenAddUser && (
        <Modal
          contentClass={staticStyle.modal}
          onClose={closeAddUserModalHandler}
          isCloseButton={false}
        >
          <AddUserForm onClose={closeAddUserModalHandler}></AddUserForm>
        </Modal>
      )}
      {isOpenLogoutAll && (
        <AlertWindowForm
          onSubmit={logoutAllUserHandler}
          onClose={() => setIsOpenLogoutAll(false)}
          title="Завершить сеансы всех пользователей?"
          buttonTitle="завершить"
          isPending={isLogoutAllUserPending}
          serverError={logoutAllUserError}
          alertClassName={style.alert}
        />
      )}
    </div>
  );
};
