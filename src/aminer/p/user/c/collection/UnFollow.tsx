import React, { useEffect, useState } from 'react';
import { Popconfirm } from 'antd';
import { FM, formatMessage } from 'locales';
import { IFollowCategory } from 'aminer/components/common_types';
import { PubInfo } from 'aminer/components/pub/pub_type';
import styles from './UnFollow.less';
import { classnames } from 'utils/';

interface IPropTypes {
  pubCategoryMap: {
    [key: string]: IFollowCategory[];
  };
  paper: PubInfo;
  unFollow: (pid: string) => void;
}

const UnFollow: React.FC<IPropTypes> = props => {
  const { pubCategoryMap, paper, unFollow } = props;

  const onUnFollow = (pid: string) => {
    if (unFollow) {
      unFollow(pid);
    }
  };

  return (
    <div className={classnames(styles.unFollow, 'un-follow')}>
      {!!(pubCategoryMap && pubCategoryMap[paper.id]) && (
        <Popconfirm
          overlayClassName="confirm_certified_popconfirm"
          placement="left"
          title={formatMessage({ id: 'aminer.paper.collect.cancel.confirm' })}
          onConfirm={() => {
            onUnFollow(paper?.id);
          }}
          okText={formatMessage({ id: 'aminer.logout.confirm.ok' })}
          cancelText={formatMessage({ id: 'aminer.logout.confirm.cancel' })}
        >
          <span className="cancel_collection">
            <FM id="aminer.paper.collect.cancel" />
          </span>
        </Popconfirm>
      )}
    </div>
  );
};

export default UnFollow;
