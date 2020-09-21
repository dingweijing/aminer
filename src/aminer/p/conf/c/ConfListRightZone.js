// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect, Link } from 'acore';
import { classnames } from 'utils';
import helper from 'helper';
import { message, Popconfirm, Icon, Switch } from 'antd';
import { isLogin, isAuthed } from 'utils/auth';
import { formatMessage, FM } from 'locales';
// import UpdateConfInfo from '../UpdateConfInfo'
import ConfirmModal from './ConfirmModal';
import Jurisdiction from './ListAction/Jurisdiction';
import styles from './ConfListRightZone.less';

const ConfListRightZone = props => {
  const { conf, user, roles, dispatch, UpdateConfInfo, total } = props;
  const [publicStatus, setPublicStatus] = useState(conf.is_public);
  const [isShowOrder, setIsShowOrder] = useState(false);

  const delConf = id => {
    dispatch({
      type: 'aminerConf/delConfById',
      payload: {
        id,
      },
    }).then(result => {
      if (result.succeed) {
        message.success('删除成功');
        dispatch({ type: 'confirmModal/close' });
        window.location.reload();
      }
    });
  };

  const cancel = () => {
    console.log('取消删除操作');
  };
  const onChangePublicStatus = value => {
    setPublicStatus(value);
    const fields = {};
    fields.id = conf.id;
    fields.is_public = value;
    dispatch({
      type: 'aminerConf/UpdateConf',
      payload: fields,
    }).then(result => {
      console.log('修改成功');
    });
  };
  const editConfInfo = conf => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'conf.update.legend', defaultMessage: '更新会议信息' }),
        extraArticleStyle: { padding: '20px 30px', height: 'calc(100vh - 100px)', width: '100%' },
        width: '800px',
        content: UpdateConfInfo({ conf }),
      },
    });
  };

  const jumpToUpOrBottom = type => {
    const fields = {};
    fields.id = conf.id;
    fields.order = type === 'top' ? 1 : total;
    dispatch({
      type: 'aminerConf/UpdateConf',
      payload: fields,
    }).then(result => {
      if (result.succeed) {
        message.success('修改成功');
        // TODO: 刷新页面
        window.location.reload();
      }
    });
  };
  const jumpByStep = type => {
    const fields = {};
    fields.id = conf.id;
    fields.order = type === 'up' ? conf.order + 1 : conf.order - 1;
    dispatch({
      type: 'aminerConf/UpdateConf',
      payload: fields,
    }).then(result => {
      if (result.succeed) {
        message.success('修改成功');
        // TODO: 刷新页面
        window.location.reload();
      }
    });
  };
  const clickTheOrder = () => {
    setIsShowOrder(!isShowOrder);
  };
  const popConfirm = conf => {
    dispatch({
      type: 'confirmModal/open',
      payload: {
        title: `你确定要删除”${conf.title}“吗`,
        onText: <FM id="conf.yes" defaultMessage="确定" />,
        cancelText: <FM id="conf.no" defaultMessage="取消" />,
        onConfirm: () => {
          delConf(conf.id);
        },
        onCancel: () => {
          dispatch({ type: 'confirmModal/close', payload: {} });
        },
      },
    });
    // return <ConfirmModal />
  };

  const updateAuthority = () => {
    const fields = {};
    fields.id = conf.id;
    fields.is_public = !conf.is_public;
    dispatch({
      type: 'aminerConf/UpdateConf',
      payload: fields,
    }).then(result => {
      if (result.succeed) {
        message.success('修改成功');
        // TODO: 刷新页面
        window.location.reload();
      }
    });
  };
  return (
    <div className={styles.ConfListRightZone}>
      {!isShowOrder && (
        <div className="allActions">
          {/* 删除 */}
          <div className="del" onClick={popConfirm.bind(null, conf)}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-delete-" />
            </svg>
          </div>
          {/* 编辑 */}
          <div className="editIcon" onClick={editConfInfo.bind(null, conf)}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-bianji" />
            </svg>
          </div>

          {/* TODO: click事件 */}
          {/* <div className={styles.lockIcon} onClick={updateAuthority}>
            {conf && conf.is_public ? '开' : '私'}
          </div> */}
          {/* <Switch checkedChildren="开" unCheckedChildren="关" checked={publicStatus} onClick={onChangePublicStatus} /> */}
          <Jurisdiction conf={conf} />
          {/* </>
      } */}
        </div>
      )}
      {/* 排序 */}
      <div
        className={classnames('order', { [styles.active]: isShowOrder })}
        onClick={clickTheOrder}
      >
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-paixu" />
        </svg>
      </div>
      {isShowOrder && (
        <div className="orderAction">
          <div className="toTop" onClick={jumpToUpOrBottom.bind(null, 'top')}>
            ^
          </div>
          <div className="up" onClick={jumpByStep.bind(null, 'up')}>
            ^
          </div>
          <div className="curr">{conf.order}</div>
          <div className="down" onClick={jumpByStep.bind(null, 'down')}>
            ^
          </div>
          <div className="toBottom" onClick={jumpToUpOrBottom.bind(null, 'bottom')}>
            ^
          </div>
        </div>
      )}
    </div>
  );
};

export default page(connect())(ConfListRightZone);
