// getSchedule

import React, { useEffect } from 'react';
import { page } from 'acore';
import styles from './CountDown.less';

interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  timeing: Date;
  time: Date;
  show: HTMLSpanElement;
}
const CountDown: React.FC<Proptypes> = props => {
  const { dispatch } = props;
  const { confInfo = {}, startTime = '', nextConfName } = props;

  const setTime = () => {
    const show = document.getElementById('show').getElementsByTagName('span');

    setInterval(() => {
      const timeing = new Date();
      const time = new Date(startTime);
      let num = time.getTime() - timeing.getTime();

      const day = parseInt(num / (24 * 60 * 60 * 1000), 10);
      num = num % (24 * 60 * 60 * 1000);
      const hour = parseInt(num / (60 * 60 * 1000), 10);
      num = num % (60 * 60 * 1000);
      const minute = parseInt(num / (60 * 1000), 10);
      num = num % (60 * 1000);
      const seconde = parseInt(num / 1000, 10);

      show[0].innerHTML = day;
      show[1].innerHTML = hour;
      show[2].innerHTML = minute;
      show[3].innerHTML = seconde;
    }, 100);
  };
  useEffect(() => {
    setTime();
  }, []);
  return (
    <a href={`/conf/${nextConfName.replace(' ', '').toLowerCase()}`} className={styles.countDown}>
      <h1>距离{nextConfName}还有：</h1>
      <p id="show">
        <span></span>天<span></span>小时<span></span>分<span></span>秒
      </p>
    </a>
  );
};

export default page()(CountDown);
