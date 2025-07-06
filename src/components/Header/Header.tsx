import { Link, useMatch, useParams } from 'react-router-dom';
import style from './Header.module.css';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
const Header = () => {
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
        <NavLink
          className={({ isActive }) => clsx(style.link, isActive && style.link_active)}
          end
          to="/administration"
        >
          администрирование
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx(style.link, isActive && style.link_active)}
          end
          to="/analytics"
        >
          аналитика и отчетность
        </NavLink>
      </nav>
    </header>
  );
};

export { Header };
