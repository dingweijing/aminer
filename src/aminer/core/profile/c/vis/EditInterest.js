/**
 *  File Created by BoGao on 2017-06-04;
 *  Moved form aminer-web, on 2017-06-04;
 *
 *  TODO 暂时不用这个模块，因此没有引入react-nvd3框架。
 */
import React, { useEffect, useState, useRef } from 'react';
import { connect, component } from 'acore';
import { formatMessage, FM } from 'locales';
import { isDeveloper } from 'utils/auth';
import { Input, Popconfirm, Select, message } from 'antd';
import { classnames } from 'utils/';
import styles from './EditInterest.less';

// ----- action
const getInterestsByYear = (dispatch, pid) => {
  // dispatch({
  //   type: 'visResearchInterest/getInterestVisData',
  //   payload: { personId },
  // });
  dispatch({
    type: 'visResearchInterest/GetPersonInterestsByYear',
    payload: { id: pid, is_year: true },
  });
};
const getInterests = (dispatch, pid) => {
  dispatch({
    type: 'visResearchInterest/GetPersonInterests',
    payload: { id: pid, show: 20, is_year: false },
  });
};
// const getInterests = (dispatch, pid) => {
//   dispatch({
//     type: 'visResearchInterest/GetPersonInterests',
//     payload: { id: pid, display: 20 },
//   });
// };
const setInterests = (dispatch, data) => {
  dispatch({
    type: 'visResearchInterest/setPersonInterests',
    payload: { data },
  });
};
const addInterest = (dispatch, interests, interest, length, pid) => {
  const ops = [
    {
      op: 1,
      kw: interest,
    },
  ];
  if (interests[0] && (interests[0].order || interests[0].order === 0)) {
    ops.push({
      op: 3,
      order: interests[0].order - 1,
      kw: interest,
    });
  }
  dispatch({
    type: 'visResearchInterest/UpdatePersonInterests',
    payload: {
      id: pid,
      op: ops,
    },
  }).then(res => {
    if (res) {
      dispatch({
        type: 'visResearchInterest/addPersonInterests',
        payload: {
          t: interest,
        },
      });
      // getInterestsByYear(dispatch, pid);
    }
  });
};

const setShowNum = (dispatch, pid, length) => {
  dispatch({
    type: 'visResearchInterest/UpdatePersonInterests',
    payload: {
      id: pid,
      // op: 4,
      show: length,
      // type: 4, // 显示数量
    },
  }).then(res => {
    if (res) {
      // getInterestsByYear(dispatch, pid);
    }
  });
};

const deleteInterest = (dispatch, interest, pid, index) => {
  dispatch({
    type: 'visResearchInterest/UpdatePersonInterests',
    payload: {
      id: pid,
      op: [
        {
          op: 2, // 删除
          kw: interest,
        },
      ],
    },
  }).then(res => {
    if (res) {
      dispatch({
        type: 'visResearchInterest/delPersonInterests',
        payload: { index },
      });
      // getInterestsByYear(dispatch, pid);
    }
  });
};

const orderInterest = (dispatch, interests, pid) => {
  const ops = interests.map((interest, index) => ({
    op: 3,
    order: index + 1,
    kw: interest.t,
  }));
  dispatch({
    type: 'visResearchInterest/UpdatePersonInterests',
    payload: {
      id: pid,
      op: ops,
    },
  }).then(res => {
    if (res) {
      message.success(formatMessage({ id: 'aminer.common.success' }));
      // getInterestsByYear(dispatch, pid);
    }
  });
};

const resetInterest = (dispatch, pid) => {
  dispatch({
    type: 'visResearchInterest/ResetInterests',
    payload: {
      id: pid,
    },
  }).then(res => {
    if (res) {
      message.success(formatMessage({ id: 'aminer.common.success' }));
      getInterests(dispatch, pid);
      // getInterestsByYear(dispatch, pid);
    }
  });
};

const moveInterestToTop = (dispatch, index) => {
  dispatch({
    type: 'visResearchInterest/moveInterestToTop',
    payload: { index },
  });
};

const exchangeInterestsOrder = (dispatch, move1, move2) => {
  dispatch({
    type: 'visResearchInterest/exchangeInterestsOrder',
    payload: { move1, move2 },
  });
};

//  ----- main

const EditInterest = props => {
  const { dispatch, pid, display_num, is_new_data, user } = props;
  const personInterests = props && props.personInterests;
  // const [display, setDisplay] = useState(display_num);

  useEffect(() => {
    // PersonInterest.GetPersonInterests
    getInterests(dispatch, pid);
    return () => {
      getInterestsByYear(dispatch, pid);
    };
  }, [pid]);

  const setDisplayNum = num => {
    setShowNum(dispatch, pid, num);
    dispatch({
      type: 'visResearchInterest/setPersonInterestDisplay',
      payload: {
        display_num: num,
      },
    });
    // setDisplay(num);
  };

  const retry = (id = pid) => {
    dispatch({
      type: 'visResearchInterest/Calculation',
      payload: { id },
    }).then(data => {
      if (data) {
        getInterests(dispatch, id);
      }
    });
  };

  return (
    <div className={styles.editInterest}>
      {/* <div className="srcoll_view"> */}
      {/* <Preview display_num={display_num} interests={personInterests} /> */}
      <InterestFix
        pid={pid}
        display_num={display_num}
        is_new_data={is_new_data}
        dispatch={dispatch}
        interests={personInterests}
      />
      <div className="select_num">
        <div>
          <FM id="aminer.interest.shownum" />
          <SelectItem
            display_num={display_num}
            setDisplayNum={setDisplayNum}
            is_new_data={is_new_data}
          />
        </div>
        <div className="right">
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
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default component(
  connect(({ visResearchInterest, auth }) => ({
    user: auth.user,
    personInterests: visResearchInterest.personInterests,
    display_num: visResearchInterest.interest_display,
    is_new_data: visResearchInterest.is_new_data,
  })),
)(EditInterest);

//  -----component
const InterestFix = props => {
  const { interests, dispatch, pid, display_num, is_new_data } = props;
  // const { onResetInterest } = props;
  const [isSort, setIsSort] = useState();
  const [isAdd, setIsAdd] = useState();
  const sortsTemp = useRef();
  const scrollRef = useRef();
  // const addInputRef = useRef();

  const clickAddBtn = () => {
    // console.log('addInputRef', addInputRef);
    // addInputRef.current && addInputRef.current.focus();
    if (!is_new_data) {
      return;
    }
    if (!isAdd) {
      scrollRef.current && scrollRef.current.scrollTo(0, 0);
      setIsAdd(true);
    }
  };

  const onAddInterest = interest => {
    if (interest) {
      addInterest(dispatch, interests, interest, interests.length, pid);
    }
    setIsAdd(false);
  };

  const clickSortBtn = () => {
    if (!is_new_data) {
      return;
    }
    if (!isSort) {
      sortsTemp.current = [...interests];
      setIsSort(true);
    }
  };

  const clickCancelSortBtn = () => {
    setInterests(dispatch, sortsTemp.current);
    setIsSort(false);
  };

  const clickConfirmSortBtn = () => {
    orderInterest(dispatch, interests, pid);
    setIsSort(false);
  };

  const onDeleteInterest = (index, interest) => {
    deleteInterest(dispatch, interest, pid, index);
  };

  const onResetInterest = () => {
    resetInterest(dispatch, pid);
    setIsAdd(false);
    setIsSort(false);
  };

  const toTop = index => {
    moveInterestToTop(dispatch, index);
  };

  const moveUp = index => {
    exchangeInterestsOrder(dispatch, index - 1, index);
  };

  const moveDown = index => {
    exchangeInterestsOrder(dispatch, index, index + 1);
  };

  return (
    <div className={styles.interestsFix}>
      <div className={classnames('addclear', { disable: !is_new_data })}>
        <div>
          <span className={classnames('add_btn btn', { is_add: isAdd })} onClick={clickAddBtn}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-jia" />
            </svg>
            <FM id="aminer.interest.add" />
          </span>
          <Popconfirm
            placement="leftTop"
            overlayStyle={{ width: '320px' }}
            title={formatMessage({
              id: 'aminer.interest.reset.describe',
              defaultMessage: 'Reset',
            })}
            disabled={!is_new_data}
            onConfirm={onResetInterest}
            okText={formatMessage({ id: 'aminer.logout.confirm.ok', defaultMessage: 'Yes' })}
            okType="danger"
            cancelText={formatMessage({
              id: 'aminer.logout.confirm.cancel',
              defaultMessage: 'No',
            })}
          >
            <span className="reset_btn btn">
              <FM id="aminer.interest.reset" />
            </span>
          </Popconfirm>
        </div>
        <div>
          {!isSort && (
            <span className={classnames('btn')} onClick={clickSortBtn}>
              {/* <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-jia" />
            </svg> */}
              <FM id="aminer.interest.sort" />
            </span>
          )}
          {isSort && (
            <span className="sort_btns">
              <span className={classnames('btn ok')} onClick={clickConfirmSortBtn}>
                <FM id="aminer.common.ok" />
              </span>
              <span className={classnames('btn')} onClick={clickCancelSortBtn}>
                <FM id="aminer.common.cancel" />
              </span>
            </span>
          )}
        </div>
      </div>
      <div className="srcoll_view">
        <div className="interest_title">
          <span className="label">
            <FM id="aminer.interest.show" defaultMessage="Show" />
          </span>
          <span className="interest">
            <FM id="aminer.interest" defaultMessage="Interest" />
          </span>
          <span className="total">
            <FM id="aminer.interest.tf" defaultMessage="Term Freq" />
          </span>
          <span className="edit_btns">
            {/* {!isEdit && (
          <span className="btn" onClick={editInterset}>
            E
          </span>
        )}
        {isEdit && (
          <span className="btn" onClick={commitInterset}>
            √
          </span>
        )} */}
            {!isSort && is_new_data && (
              <span className="btn del">
                <FM id="aminer.interest.edit.del" defaultMessage="Delete" />
              </span>
            )}
            {isSort && (
              <>
                <span className="btn move">
                  <FM id="aminer.interest.edit.top" defaultMessage="Top" />
                </span>
                <span className="btn move">
                  <FM id="aminer.interest.edit.up" defaultMessage="Up" />
                </span>
                <span className="btn move">
                  <FM id="aminer.interest.edit.down" defaultMessage="Down" />
                </span>
              </>
            )}
          </span>
        </div>
        <div className="srcoll_inner" ref={scrollRef}>
          <ul className="interest_list">
            {isAdd && <AddInterestInput isAdd={isAdd} addInterest={onAddInterest} />}
            {interests &&
              interests.length > 0 &&
              interests.map((interest, index) => (
                <InterestLine
                  key={interest.t}
                  interest={interest}
                  is_new_data={is_new_data}
                  isSort={isSort}
                  sort={index}
                  showUp={index !== 0}
                  highlight={index < display_num}
                  showDown={index !== interests.length - 1}
                  toTop={toTop.bind(null, index)}
                  moveUp={moveUp.bind(null, index)}
                  moveDown={moveDown.bind(null, index)}
                  delInterest={onDeleteInterest.bind(null, index)}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const InterestLine = props => {
  const { delInterest, interest, isSort, highlight, is_new_data, sort } = props;
  const { toTop, moveUp, moveDown, showUp, showDown } = props;
  const { t: interest_name, n: total } = interest;

  const onDelete = keyword => {
    if (delInterest) {
      delInterest(keyword);
    }
  };

  const onTop = () => {
    if (toTop) {
      toTop();
    }
  };
  const onMoveUp = () => {
    if (moveUp) {
      moveUp();
    }
  };
  const onMoveDown = () => {
    if (moveDown) {
      moveDown();
    }
  };

  return (
    <li className={styles.interestItem}>
      <span className="label">{highlight ? sort + 1 : ''}</span>
      <span className={classnames('interest_name', { highlight })}>
        <span>{interest_name}</span>
        {/* .replace(/( |^)[a-z]/g, L => L.toUpperCase()) */}
        {/* {!isEdit && <span>{interestName}</span>} */}
        {/* {isEdit && <Input value={interestName} onChange={onChange} />} */}
      </span>
      <span className="total">{total}</span>
      <span className="edit_btns">
        {/* {!isEdit && (
          <span className="btn" onClick={editInterset}>
            E
          </span>
        )}
        {isEdit && (
          <span className="btn" onClick={commitInterset}>
            √
          </span>
        )} */}
        {!isSort && is_new_data && (
          <span className="btn del">
            <Popconfirm
              placement="leftTop"
              title={`${formatMessage({
                id: 'aminer.paper.comment.delete',
                defaultMessage: 'Delete',
              })} ${interest_name}`}
              onConfirm={() => onDelete(interest_name)}
              okText={formatMessage({ id: 'aminer.logout.confirm.ok', defaultMessage: 'Yes' })}
              okType="danger"
              cancelText={formatMessage({
                id: 'aminer.logout.confirm.cancel',
                defaultMessage: 'No',
              })}
            >
              <span className={styles.btn}>
                <i className="fa fa-trash-o" />
                {/* <span className={styles.label}>
                {formatMessage({ id: 'aminer.paper.comment.delete', defaultMessage: 'Delete' })}
              </span> */}
              </span>
            </Popconfirm>
          </span>
        )}
        {isSort && (
          <>
            <>
              <span className="btn move" onClick={onTop}>
                {showUp && (
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-to_top" />
                  </svg>
                )}
              </span>
              <span className="btn move" onClick={onMoveUp}>
                {showUp && (
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-move_up" />
                  </svg>
                )}
              </span>
              {!showDown && <span className="btn hide"></span>}
            </>

            {showDown && (
              <>
                <span className="btn move" onClick={onMoveDown}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-move_down" />
                  </svg>
                </span>
              </>
            )}
          </>
        )}
      </span>
    </li>
  );
};

const AddInterestInput = props => {
  const { addInterest: addKeyword, isAdd } = props;
  const [interestName, setInterestName] = useState('');
  const inputRef = useRef();
  // useImperativeHandle(ref, () => ({
  //   focus: () => {
  //     inputRef.current.focus();
  //   },
  // }));
  useEffect(() => {
    if (isAdd) {
      inputRef.current.focus();
    }
  }, [isAdd]);
  const onChange = e => {
    setInterestName(e.target.value);
  };
  const onCommit = () => {
    if (addKeyword) {
      addKeyword(interestName);
      setInterestName('');
    }
  };
  return (
    <li className={classnames(styles.interestItem, styles.add)}>
      <span className="label" />
      <span className="interest_name">
        {/* .replace(/( |^)[a-z]/g, L => L.toUpperCase()) */}
        <Input value={interestName} onChange={onChange} ref={inputRef} />
      </span>
      <span className="edit_btns">
        <span className="btn" onClick={onCommit}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-confirm" />
          </svg>
        </span>
      </span>
    </li>
  );
};

const Preview = props => {
  const { display_num, interests } = props;
  if (!interests || interests.length === 0) {
    return false;
  }
  return (
    <div className={styles.previewView}>
      <FM id="aminer.paper.preview" />
      <div className="interests">
        {interests.slice(0, display_num).map(item => {
          return (
            <span className="interest" key={item.t}>
              {item.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const SelectItem = props => {
  const { display_num, setDisplayNum, is_new_data } = props;
  const min = 2;
  const max = 10;
  const nums = getNumArr(min, max);

  const onChange = value => {
    if (setDisplayNum) {
      setDisplayNum(value);
    }
  };

  return (
    <Select
      value={display_num}
      disabled={!is_new_data}
      size="small"
      style={{ width: '60px' }}
      onChange={onChange}
    >
      {nums &&
        nums.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );
};

// ----- function
const getNumArr = (min, max) => {
  const arr = Array(max - min + 1)
    .fill(min)
    .map((item, index) => item + index);
  return arr;
  // const arr = Array(max-min+1);
  // arr.fill(min).reduce((res, cur, index) => {
  //   res[index] = cur + index;
  //   return res;
  // }, arr);
};
