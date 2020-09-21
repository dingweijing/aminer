import React, { } from 'react';
import { component } from 'acore';
import { Panel } from 'aminer/ui/panel';
// import { classnames } from 'utils';
import { PaperAbstract } from './index';
import styles from './PaperBasicInfoZh.less';

const PaperBasicInfoZh = props => {
  const paper = props.paper || {};
  const { abstract_zh, title_zh } = paper;

  const content = () => {
    return (
      <div className={styles.content}>
        <PaperAbstract
          lang='zh' absTitleClass='absTitleClass'
          abstract={abstract_zh}
        />
      </div>
    );
  }

  return (
    <div className={styles.paperBasicInfoZh}>
      <Panel
        hide
        title={<div className={styles.title}>
          <span className={styles.label}>ZH</span>
          <span>{title_zh}</span>
        </div>}
        subContent={content}
      />
    </div>
  )
}

export default component()(PaperBasicInfoZh)
