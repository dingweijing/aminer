import React, { useState } from 'react';
import { connect, component } from 'acore';
import { FM, formatMessage } from 'locales';
import { isRoster, isDeveloper } from 'utils/auth';
import { Tooltip, message } from 'antd';
import VisResearchInterest from './vis-research-interest';
import EditInterest from './EditInterest';
import styles from './ResearchInterest.less';

const ResearchInterest = props => {
  const { dispatch, pid, user, researchInterest, oldResearchInterest } = props;

  const [isNewData, setIsNewData] = useState(false);
  const [tip, setTip] = useState('');

  const getInterestVisData = (id = pid) => {
    dispatch({
      type: 'visResearchInterest/GetPersonInterestsByYear',
      payload: { id: pid, is_year: true },
    }).then(data => {
      if (data) {
        setIsNewData(true);
      } else {
        setIsNewData(false);
        dispatch({
          type: 'visResearchInterest/getInterestVisData',
          payload: { personId: id },
        });
      }
    });
  };

  const retry = (id = pid) => {
    dispatch({
      type: 'visResearchInterest/Calculation',
      payload: { id },
    }).then(data => {
      if (data) {
        getInterestVisData();
      }
      // const { cur_list, que_list } = status;
      // const cur_index = cur_list.indexOf(id);
      // const que_index = que_list.indexOf(id);
      // console.log('cur_index', cur_index);
      // console.log('que_index', que_index);
      // if (cur_index !== -1) {
      //   setTip('正在计算');
      // } else if (que_index !== -1) {
      //   setTip(`当前排在第${que_index + 1}位计算`);
      // } else {
      //   setTip('等待计算中');
      // }
    });
  };

  const cutInLine = id => {
    dispatch({
      type: 'visResearchInterest/SetScore',
      payload: { id, score: 20 },
    }).then(res => {
      if (res) {
        message.success('成功');
      }
    });
  };

  const editInterest = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.interest.edit.title' }),
        content: <EditInterest retry={retry} pid={pid} />,
      },
    });
  };

  return (
    <div className={styles.visResearchInterest}>
      <div className="title">
        <FM id="aminer.person.research_interests" defaultMessage="Research Interests" />
        <div className="title_right">
          {isDeveloper(user) && (
            // !(researchInterest && researchInterest.interests) &&
            // oldResearchInterest &&
            // oldResearchInterest.interests &&
            // !isNewData &&
            <div>
              <span className="retry" onClick={retry.bind(null, pid)}>
                {/* <FM id="aminer.interest.retry" /> */}
                重新计算
              </span>
              {/* <span className="cut" onClick={cutInLine.bind(null, pid)}>
                优先计算
              </span> */}
            </div>
          )}
          {isRoster(user) && isNewData && (
            <Tooltip
              placement="top"
              title={formatMessage({
                id: 'aminer.interest.edit.title',
                defaultMessage: 'Manually Edit Research Interest',
              })}
            >
              <span className="edit_interest" onClick={editInterest}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-edit" />
                </svg>
              </span>
            </Tooltip>
          )}
        </div>

        {/* {isDeveloper(user) &&
          !(researchInterest && researchInterest.interests) &&
          oldResearchInterest &&
          oldResearchInterest.interests &&
          !isNewData && (
          )} */}
      </div>
      <div className="content">
        <VisResearchInterest
          getInterestVisData={getInterestVisData}
          setIsNewData={setIsNewData}
          personId={pid}
        />
      </div>
    </div>
  );
};

export default component(
  connect(({ visResearchInterest, auth }) => ({
    user: auth.user,
    oldResearchInterest: visResearchInterest.oldResearchInterest,
    researchInterest: visResearchInterest.researchInterest,
  })),
)(ResearchInterest);
