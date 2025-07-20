import { Link, useMatch, useParams } from 'react-router-dom';
import style from './Header.module.css';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { selectUser } from '@services/userSlice';
import { useSelector } from '@services/store';
const Header = () => {
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));

  return (
    <header className={style.header}>
      <nav className={style.navigation}>
        <NavLink
          className={({ isActive }) => clsx(style.link, isActive && style.link_active)}
          end
          to="/"
        >
          главная
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx(style.link, isActive && style.link_active)}
          end
          to="/incidents"
        >
          происшествия
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx(style.link, isActive && style.link_active)}
          end
          to="/profile"
        >
          профиль
        </NavLink>
      </nav>
      <nav className={style.navigation}>
        {(user?.role === 'администратор' || user?.role === 'руководитель') && (
          <NavLink
            className={({ isActive }) => clsx(style.link, isActive && style.link_active)}
            end
            to="/analytics"
          >
            аналитика и отчетность
          </NavLink>
        )}

        {user?.role === 'администратор' && (
          <NavLink
            className={({ isActive }) => clsx(style.link, isActive && style.link_active)}
            end
            to="/administration"
          >
            администрирование
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export { Header };
