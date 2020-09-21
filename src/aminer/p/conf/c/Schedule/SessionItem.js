import React, { useEffect, useState } from 'react';
import { page, connect, history } from 'acore';
import { classnames } from 'utils';
import { Button, message, Pagination, Icon, Popconfirm } from 'antd';
import { isLogin, isAuthed } from 'utils/auth';
import { Spin } from 'aminer/components/ui';
import AddSessionPubForm from './AddSessionPubForm';
import ConfPaperList from '../Paper/ConfPaperList';
import styles from './SessionItem.less';

const SessionItem = props => {
  const [icon, setIcon] = useState('add');
  const [pubs, setPubs] = useState();
  const [pubsLoading, setPubsLoading] = useState(true);
  const { confInfo, schedule, getScheduleData, index, scheduleTypeToColor, timecov } = props;
  const { user, roles, dispatch, showAction } = props;

  const addSessionPubModal = sche_id => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: 'Add Session Pub',
        extraArticleStyle: { padding: '20px' },
        content: (
          <AddSessionPubForm
            getAllList={() => {
              getScheduleData();
            }}
            dispatch={dispatch}
            sche_id={sche_id}
            confInfo={confInfo}
          />
        ),
      },
    });
  };
  const deleteSession = id => {
    dispatch({
      type: 'aminerConf/DeleteSchedule',
      payload: { id },
    }).then(res => {
      if (res) {
        message.success('session 删除成功');
        getScheduleData();
      } else {
        message.error('error');
      }
    });
  };

  const getTheSessionPubs = () => {
    if (icon === 'add') {
      dispatch({
        type: 'aminerConf/GetPubsBySId',
        payload: {
          sid: schedule.id,
          conf_id: confInfo.id,
        },
      }).then(res => {
        setPubs(res);
        setPubsLoading(false);
      });
    }
    setIcon(icon === 'subtraction' ? 'add' : 'subtraction');
  };
  return (
    <div className={styles.sessionItem}>
      <div className="header" style={{ borderLeftColor: scheduleTypeToColor[schedule.type].icon }}>
        {/* 收起论文操作按钮 */}
        <div
          className={classnames('headMain')}
          onClick={() =>
            schedule.type === 'poster'
              ? history.push(`/conf/${confInfo.short_name}/invited_talk`)
              : getTheSessionPubs()
          }
        >
          {schedule.type !== 'poster' && showAction && (
            <div
              className="action"
              style={{ backgroundColor: scheduleTypeToColor[schedule.type].icon }}
              onClick={getTheSessionPubs.bind()}
            >
              <svg className={classnames('icon')} aria-hidden="true">
                <use xlinkHref={`#icon-${icon}`} id={`arrow${index}`} />
              </svg>
            </div>
          )}

          <div className="right">
            <div className="title" style={{ color: scheduleTypeToColor[schedule.type].title }}>
              {schedule.title}
            </div>
            <div className="time">
              <span>{timecov(schedule.begin_time, schedule.end_time)}</span>
            </div>
          </div>
        </div>
        {/* 添加论文操作 */}
        {isLogin(user) && isAuthed(roles) && (
          <div className={classnames('desktop_device annotationArea', 'operate')}>
            <Icon type="file-add" onClick={addSessionPubModal.bind(this, schedule.id)} />
            <Popconfirm
              title="delete this?"
              onConfirm={deleteSession.bind(this, schedule.id)}
              okText="Yes"
              cancelText="No"
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-delete-" />
              </svg>
            </Popconfirm>
          </div>
        )}
      </div>
      {icon === 'subtraction' && (
        <div
          className={classnames('footer')}
          id={`paper${index}`}
          style={{ borderLeftColor: scheduleTypeToColor[schedule.type].icon }}
        >
          <Spin loading={pubsLoading} size="small" />
          <ConfPaperList
            pubs={pubs}
            user={user}
            confInfo={confInfo}
            color={scheduleTypeToColor[schedule.type].icon}
          />
        </div>
      )}
    </div>
  );
};
export default page(
  connect(({ auth, aminerConf }) => ({
    user: auth.user,
    roles: auth.roles,
    confInfo: aminerConf.confInfo,
  })),
)(SessionItem);
