
import React, { useEffect, useState, useMemo } from 'react';
import { connect, component } from 'acore';
import { classnames } from 'utils';
import { message, Checkbox, Button } from 'antd';
import { cloneDeep } from 'lodash';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import pubHelper from 'helper/pub';
import styles from './ComfirmStarPaper.less';


const ComfirmStarPaper = props => {
  const { resetList, pid, data: list, dispatch } = props;

  const [data, setData] = useState(cloneDeep(list));

  const starPaperToPerson = () => {
    const items = Object.keys(data);
    if (items && items.length) {
      dispatch({
        type: 'editProfile/starPaperToPerson',
        payload: {
          "pids": items,
          "id": pid
        }
      }).then(res => {
        if (res) {
          message.success('success');
          resetList();
        } else {
          message.error('error');
        }
      }).catch(() => {
        message.error('error');
      })
    } else {
      message.warning('请选择星标论文')
    }
  }

  const checkPaper = (item, e) => {
    if (e.target.checked) {
      data[item.id] = item;
    } else {
      if (data[item.id]) {
        delete data[item.id];
      }
    }
    setData({ ...data });
  }

  const contentRightZone = [
    ({ paper }) => {
      return (
        <Checkbox checked={!!data[paper.id]} onChange={checkPaper.bind(this, paper)} />
      );
    }
  ]

  const onCancle = () => {
    dispatch({
      type: 'modal/close',
    })
  }

  return (
    <div className={styles.comfirmStarPaper}>
      <PublicationList
        className="profliePaperList"
        papers={Object.values(list)}
        contentRightZone={contentRightZone}
      />
      <div className={styles.footer}>
        <Button onClick={starPaperToPerson} type='primary' className={styles.submit}>提交</Button>
        <Button onClick={onCancle}>取消</Button>
      </div>
    </div>
  )
}

export default component(connect())(ComfirmStarPaper)
