import React, { useEffect, useState } from 'react';
import { page, connect, component } from 'acore';
import PaperList from 'aminer/p/conf/c/Paper/ConfPaperList';
import DropDownData from './DropDownData';

const AuthorBottomZone = props => {
  const { person, others, dispatch, confInfo, type } = props;
  const { related } = others || {};

  const [author_pubs, setAuthorPubs] = useState(false);
  const [load, setLoad] = useState(false);

  const beforeDown = ({ key, reset }) => {
    if (reset) {
      setAuthorPubs([]);
    }
    if (key) {
      getPubs(key);
    }
  };

  const getPubs = key => {
    setLoad(true);
    const { conf_id, conf_name, pids } = related[key - 0] || {};
    dispatch({
      type: 'aminerConf/GetPubsByIds',
      payload: {
        conf_id,
        pids,
      },
    }).then(res => {
      setLoad(false);
      setAuthorPubs(res);
    });
  };

  const labels =
    related &&
    related.map((item, index) => {
      const name =
        item.conf_name &&
        item.conf_name.replace(/[a-zA-Z0-9].*(?=[0-9]{4})/, $1 => {
          return `${$1.toUpperCase()} `;
        });
      return {
        key: `${index}`,
        text: `${name} (${(item.pids && item.pids.length) || 0})`,
      };
    });

  if (!labels) {
    return false;
  }
  return (
    <DropDownData
      key="contentBottomZone"
      beforeDown={beforeDown}
      loading={load}
      label={labels}
      dataZone={
        !author_pubs
          ? []
          : [
              () => {
                return (
                  <PaperList
                    pubs={author_pubs}
                    isShowHeadline={false}
                    isTagClick={false}
                    contentLeftZone={[]}
                    confInfo={confInfo}
                  />
                );
              },
            ]
      }
    />
  );
};

export default component(connect())(AuthorBottomZone);
