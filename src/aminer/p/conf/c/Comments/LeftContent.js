import React from 'react';
// import { Checkbox, Button } from 'antd';
import { page, connect } from 'acore';
// import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
// import { Spin } from 'aminer/components/ui';
import MostViewAndLike from '../Schedule/MostViewAndLike';
import styles from './LeftContent.less';

const LeftContent = props => {
  const { confInfo } = props;
  return (
    <div className={styles.infoAndAdv} id="keywords_list">
      {confInfo && confInfo.short_name === 'iclr2020' && (
        <>
          <div className="info_ledgend">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-xinxi1" />
            </svg>
            <FM id="aminer.conf.comment.leftLegend" default="Infomation" />
          </div>
          <div className="info_content">
            <FM
              id="aminer.conf.comment.leftInfo"
              default="对今年的ICLR、对机器学习，你有什么想说的，欢迎在右侧留言，探讨科学本质。"
            />
          </div>
        </>
      )}
      <MostViewAndLike id={confInfo.id} confInfo={confInfo} />
    </div>
  );
};

export default page(connect())(LeftContent);
