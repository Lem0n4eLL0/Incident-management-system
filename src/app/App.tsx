import { TestComponent } from '@components/TestCompopnent';
import style from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@layout/MainLayout';
import { HomePage } from '@pages/HomePage';
import { ErrorPage } from '@pages/ErrorPage';

const App = () => {
  return (
    <div className={style.app}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />}></Route>
            <Route path="incidents" element={<HomePage />}></Route>
            <Route path="profile" element={<HomePage />}></Route>
            <Route path="administration" element={<HomePage />}></Route>
            <Route path="analytics" element={<HomePage />}></Route>
          </Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export { App };
