import { Header } from '@components/Header';
import { Outlet } from 'react-router-dom';
import style from './MainLayout.module.css';
const MainLayout = () => {
  return (
    <>
      <Header />
      <main className={style.main}>
        <Outlet />
      </main>
    </>
  );
};

export { MainLayout };
