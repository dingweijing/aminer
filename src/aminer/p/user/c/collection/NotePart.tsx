import React, { ReactNode, useState } from 'react';
import { classnames } from 'utils';
import { Popover } from 'antd';
import { formatMessage, FM } from 'locales';
import { WriteNote } from 'aminer/components/common';
import styles from './NotePart.less';

interface IPropTypes {
  title?: string | ReactNode;
  pid: string;
  cid: string;
  comments?: string;
  updatePubComment: (pid: string, comment: string) => void;
}

const NotePart: React.FC<IPropTypes> = props => {
  const { title, ...noteParams } = props;
  const [visible, setVisible] = useState<boolean>(false);

  const handleVisibleChange = (vis: boolean) => {
    setVisible(vis);
  };

  return (
    <span className={classnames(styles.notion, 'notion')}>
      {/* <OpenModalWithAntd content={<span>111</span>}>
      </OpenModalWithAntd> */}
      <Popover
        visible={visible}
        placement="right"
        overlayClassName="default-comment-popover"
        title={title || <Title />}
        content={<WriteNote {...noteParams} setVisible={setVisible} />}
        trigger="click"
        onVisibleChange={handleVisibleChange}
      >
        <div className="btn">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-biaozhu" />
          </svg>
          <FM id="aminer.pub.collection.note" defaultMessage="Note" />
        </div>
      </Popover>
    </span>
  );
};

export default NotePart;

const Title = () => {
  return (
    <div className={styles.popTitle}>
      <svg className="icon" aria-hidden="true">
        <use xlinkHref="#icon-biaozhu" />
      </svg>
      {formatMessage({
        id: 'aminer.pub.collection.note.title',
        defaultMessage: 'Note Content',
      })}
    </div>
  );
};
