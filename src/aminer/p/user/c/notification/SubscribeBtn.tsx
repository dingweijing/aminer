import React, { ReactNode, useState } from 'react';
import { classnames } from 'utils';
import { Popover, message } from 'antd';
import { formatMessage, FM } from 'locales';
// import SubscribeInput from './SubscribeInput';
import { IUserInfo } from 'aminer/components/common_types';
import { SubscribeInput } from './index';
import styles from './SubscribeBtn.less';

interface IPropTypes {
  userinfo: IUserInfo;
}

const SubscribeBtn: React.FC<IPropTypes> = props => {
  const { userinfo } = props;
  const [visible, setVisible] = useState<boolean>(false);

  const handleVisibleChange = (vis: boolean) => {
    setVisible(vis);
  };

  return (
    <span className={classnames(styles.subscribeBtn, 'subscribe-btn')}>
      {/* <OpenModalWithAntd content={<span>111</span>}>
      </OpenModalWithAntd> */}
      <Popover
        visible={visible}
        placement="left"
        overlayClassName="default-comment-popover"
        title={<FM id="aminer.subscribe.email.btn" />}
        content={<SubscribeInput setVisible={setVisible} userinfo={userinfo} />}
        trigger="click"
        onVisibleChange={handleVisibleChange}
      >
        <div className="btn">
          <FM id="aminer.subscribe.email.btn" defaultMessage="Receiver Email" />
        </div>
      </Popover>
    </span>
  );
};

export default SubscribeBtn;
