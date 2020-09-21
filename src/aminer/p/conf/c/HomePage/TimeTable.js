// getSchedule

import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import { Spin } from 'aminer/components/ui';
import styles from './TimeTable.less';

const TimeTable = props => {
  // const [timeTable, setTimeTable] = useState();
  // const [selectedTime, setSelectedTime] = useState();

  const {
    timeTable,
    dispatch,
    confInfo,
    filters,
    showMenu,
    isMobileClickMenu,
    SetOrGetViews,
  } = props;

  const formatTime = time => {
    const date = new Date(time);
    return `${DigToEngByMonth[date.getMonth() + 1]} ${date.getDate()}  (${
      DigToEngByWeek[date.getDay()]
    })`;
  };

  const setSelectedValue = ({ tt, day, type }) => {
    // setSelectedTime(selectedTime === type ? '' : type);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'left_timetable',
        payload: JSON.stringify({ tt, day }),
      },
    });
    SetOrGetViews('click', dispatch, confInfo.id);
    if (isMobileClickMenu) {
      showMenu();
    }
    if (filters.tt === tt && filters.time_of_day === day) {
      dispatch({ type: 'aminerConf/clearFilters' });
    }
    dispatch({ type: 'aminerConf/updateFilters', payload: { date: tt, time_of_day: day } });
  };
  return (
    <div className={classnames(styles.timeTable)}>
      <div className="schedule_time">
        {timeTable &&
          timeTable.map((tt, index) => {
            return (
              <div
                key={tt.date}
                className={classnames('timeBlock', {
                  active: filters && filters.date === tt.date,
                })}
              >
                <div
                  className={classnames('month', {
                    [styles.active]: filters && filters.date === tt.date && !filters.time_of_day,
                  })}
                  onClick={setSelectedValue.bind(null, { tt: tt.date, type: formatTime(tt.date) })}
                >
                  {`${formatTime(tt.date)}`}
                </div>
                <div className="innerBlock">
                  {tt.time_of_day &&
                    tt.time_of_day.map((day, ii) => {
                      return (
                        <div
                          key={`${day}_${ii}`}
                          className={classnames('day', {
                            active:
                              filters && filters.time_of_day === day && filters.date === tt.date,
                          })}
                          onClick={setSelectedValue.bind(null, {
                            tt: tt.date,
                            day,
                            type: `${day}${index}`,
                          })}
                        >
                          {day}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default page(
  connect(({ loading, aminerConf }) => ({
    loading: loading.effects[('aminerConf/GetMostViewPubs', 'aminerConf/GetPubsByKeywords')],
    filters: aminerConf.filters,
    isMobileClickMenu: aminerConf.isMobileClickMenu,
    timeTable: aminerConf.timeTable,
  })),
)(TimeTable);

const DigToEngByMonth = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};
const DigToEngByWeek = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const scheduleTypeToColor = {
  session: { icon: '#FFC935', title: '#DAA000' },
  poster: { icon: '#FF8AAA', title: '#D7003A' },
  keynotes: { icon: '#8AD1FF', title: '#0080D3' },
};
