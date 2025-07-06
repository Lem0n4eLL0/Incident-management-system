import { TestComponent } from '@components/TestCompopnent';
import style from './App.module.css';

const App = () => {
  return (
    <div className={style.app}>
      <TestComponent></TestComponent>
    </div>
  );
};

export { App };
