import React, { useState } from 'react';
import { component, Link } from 'acore';
import { FM } from 'locales';
import consts from 'consts';
import { classnames } from 'utils';

import styles from './Questionnaire.less';

const imagePath = `${consts.ResourcePath}/sys/aminer`;

const Questionnaire = () => {
  const [hide, setHide] = useState(false);

  const hideQuestionnaire = () => {
    setHide(true);
  };
  return (
    <section className={classnames(styles.questionnaire, { [styles.hide]: hide })}>
      <div className="image">
        <a href="http://www.ckcest.cn/survey/topic?key=ckcest&sub=aminer" target="_blank" rel="noopener noreferrer">
          <img src={`${imagePath}/ckcestwenjuan.jpg`} alt="" className="entry" />
        </a>
        <div className="close" onClick={hideQuestionnaire}>
          <img src={`${imagePath}/close.jpg`} alt="" className="close" />
        </div>
      </div>
    </section>
  );
};
export default Questionnaire;
