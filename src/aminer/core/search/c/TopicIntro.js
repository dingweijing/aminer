import React from 'react';
import consts from 'consts';
import { sysconfig } from 'systems';
import { component, Link } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import styles from './TopicIntro.less';

const { Cur_Conf_Link, Cur_Conf_Name } = sysconfig;

const TopicIntro = props => {
  const { switchToSearchPaper, topic } = props;

  const toSearch = () => {
    switchToSearchPaper && switchToSearchPaper();
  };

  return (
    <div className={styles.TopicIntro}>
      <div className={styles.item}>
        <div className={styles.topicBgImgWrap}>
          <img
            alt={Cur_Conf_Link}
            className={styles.topicBgImg}
            src={`${consts.ResourcePath}/sys/aminer/search_iclr2020_bg.jpg`}
          />
        </div>
        <Link
          target="_blank"
          to={`/conf/${Cur_Conf_Link}?from="search"`}
          className={classnames(styles.topicIntroTip, styles.iclrIntro)}
        >
          <span className={styles.title}>
            {Cur_Conf_Name}
            <img
              alt="cvpr2020"
              className={styles.arrowImg}
              src={`${consts.ResourcePath}/sys/aminer/homepage/arrow.png`}
            />
          </span>
          <span>
            <FM id="aminer.search.linkconftip" />
          </span>
        </Link>
      </div>
      {topic && (
        <div className={styles.item} onClick={toSearch}>
          <div className={styles.topicBgImgWrap}>
            <img
              alt="topic"
              className={styles.topicBgImg}
              src={`${consts.ResourcePath}/sys/aminer/search_topic_bg.jpg`}
            />
          </div>
          <div className={styles.topicIntroTip}>
            <FM id="aminer.paper.topic.viewIntro" values={{ topic }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default component(TopicIntro);
