/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useMemo } from 'react';
import { page, connect } from 'acore';
import { Button, message, Pagination, Icon, Popconfirm } from 'antd';
import { formatMessage, FM } from 'locales';
import { isLogin, isAuthed } from 'utils/auth';
import { classnames } from 'utils';
import { AutoForm } from 'amg/ui/form';
import { Spin } from 'aminer/components/ui';
import { EmptyTip } from 'components/ui';
import moment from 'moment';
import SessionForm from './Schedule/SessionForm';
import ConfPaperList from './Paper/ConfPaperList';
import ExpandAndCollapseSwitch from './Schedule/ExpandAndCollapseSwitch';
import SessionItem from './Schedule/SessionItem';
import SetOrGetViews from './SetOrGetViews';
import styles from './Schedule.less';

const scheduleTypeToColor = {
  // session: { icon: '#FFC935', title: '#DAA000' },
  session: { icon: '#8a8a8a', title: '#000' },
  poster: { icon: '#FF8AAA', title: '#D7003A' },
  keynotes: { icon: '#8AD1FF', title: '#0080D3' },
};
const SIZEPERPAGE = 100;
const Schedule = props => {
  const [data, setData] = useState();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const [scheduleStatus, setScheduleStatus] = useState('expand');

  const { confInfo, user, roles, dispatch, listLoading, tempMiddleTab } = props;

  const { filters, tab } = props;

  // session 展开收起
  // const ControlPaperModule = index => {
  // const status = document.getElementById(`paper${index}`).style.display;
  // document.getElementById(`paper${index}`).style.display = status === 'none' ? 'block' : 'none';
  // };
  // const changeAllSchedule = type => {
  //   setScheduleStatus(type);
  //   const paperModule = document.getElementsByClassName('paperModule');
  //   for (let i = 0; i < paperModule.length; i += 1) {
  //     paperModule[i].style.display = type === 'expand' ? 'block' : 'none';
  //   }
  // };

  const getScheduleData = (params = {}) => {
    if (tab === 'session') {
      dispatch({
        type: 'aminerConf/getSchedule',
        payload: {
          conf_id: confInfo.id,
          offset: (current - 1) * SIZEPERPAGE,
          size: SIZEPERPAGE,
          ...filters,
        },
      }).then(result => {
        const { items, total } = result || {};
        setData(items);
        setTotal(total);
      });
    }
  };

  useEffect(() => {
    if (tab === 'session') {
      getScheduleData({});
    }
  }, [current, filters, tab]);

  // TODO: create session
  const createSessionSubmit = (form, e) => {
    // SetOrGetViews('click', dispatch, confInfo && confInfo.id);
    e.preventDefault();
    form.validateFields((err, values) => {
      const fields = [];
      const payload = {};
      if (!err) {
        Object.entries(values).map(([field, value]) => {
          if (value) {
            payload[field] = value;
          }
        });
      }
      dispatch({
        type: 'aminerConf/CreateSchedule',
        payload: {
          conf_id: confInfo.id,
          ...payload,
        },
      }).then(result => {
        if (result.succeed) {
          message.success('session 添加成功');
          dispatch({ type: 'modal/close' });
          getScheduleData();
        }
      });
    });
  };
  const openPopModal = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({
          id: 'aminer.conf.session.createTitle',
          defaultMessage: 'Create a session',
        }),
        extraArticleStyle: { padding: '20px 30px' },
        content: (
          <SessionForm confInfo={confInfo} handleSubmit={createSessionSubmit} type="create" />
        ),
      },
    });
  };

  // 5e6f3c26a7058c6e3520dbd3
  return (
    <div className={styles.Schedules}>
      <div className="desktop_device">
        {isLogin(user) && isAuthed(roles) && (
          <Button className="annotationArea" onClick={openPopModal}>
            Create a session or keynote
          </Button>
        )}
      </div>
      <Spin loading={listLoading} />
      <div className="content">
        {data && data.length > 0 ? (
          data.map((schedule, index) => {
            return (
              <SessionItem
                key={schedule.id}
                schedule={schedule}
                getScheduleData={getScheduleData}
                index={index}
                scheduleTypeToColor={scheduleTypeToColor}
                timecov={timecov}
                showAction={tempMiddleTab.includes('paper')}
              />
            );
          })
        ) : (
            <EmptyTip />
          )}
        {total > SIZEPERPAGE && (
          <Pagination
            className={styles.pagination}
            defaultCurrent={1}
            current={current}
            total={total}
            onChange={curr => setCurrent(curr)}
            pageSize={SIZEPERPAGE}
          />
        )}
      </div>
    </div>
  );
};

export default page(
  connect(({ auth, loading, aminerConf }) => ({
    user: auth.user,
    roles: auth.roles,
    filters: aminerConf.filters,
    listLoading: loading.effects['aminerConf/SearchSchedule'],
  })),
)(Schedule);

const timecov = (start, end) => {
  const sDate = start.split('T')[1].split(':');
  const eDate = end.split('T')[1].split(':');
  // let stime = parseInt(sDate[0], 10) + 5;
  // let etime = parseInt(eDate[0], 10) + 5;
  let stime = sDate[0];
  let etime = eDate[0];

  return `${stime}:${sDate[1]} - ${etime}:${eDate[1]}`;
  // if (stime > 12 && stime < 24) {
  //   stime -= 12;
  //   if (stime < 10) {
  //     stime = `0${stime}`;
  //   }
  //   stime += `:${sDate[1]} PM`;
  // } else {
  //   if (stime > 24) {
  //     stime -= 24;
  //   }
  //   if (stime < 10) {
  //     stime = `0${stime}`;
  //   }
  //   stime += ':00 AM';
  // }

  // if (etime > 12 && etime < 24) {
  //   etime -= 12;
  //   if (etime < 10) {
  //     etime = `0${etime}`;
  //   }
  //   etime += `:${eDate[1]} PM`;
  // } else {
  //   if (etime > 24) {
  //     etime -= 24;
  //   }
  //   if (etime < 10) {
  //     etime = `0${etime}`;
  //   }
  //   etime += `:${eDate[1]} AM`;
  // }
  // return `${stime} - ${etime}`;
};
