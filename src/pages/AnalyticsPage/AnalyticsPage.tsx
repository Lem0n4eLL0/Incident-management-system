import { Loader } from '@components/ui/Loader';
import style from './AnalyticsPage.module.css';
import staticStyle from '@style/common.module.css';
import formStyle from '@style/form.module.css';

export const AnalyticsPage = () => {
  return (
    <div className={style.content}>
      <section className={style.charts}></section>
    </div>
  );
};
