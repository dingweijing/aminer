import React, { Fragment, useEffect } from 'react';
import { component } from 'acore';
import { sysconfig } from 'systems';
import { FD, zhCN, FM, formatMessage } from 'locales';
import moment from 'moment';
import styles from './SearchEBList.less';

const SearchEBList = props => {
  const { query, data, matched } = props;
  const { id, logo, person_count, stats, created_time, updated_time } = data;
  let { name, name_zh, desc_zh, desc } = data;
  const time = updated_time || created_time;

  const isZh = sysconfig.Locale === zhCN;
  name = isZh ? name_zh || name : name || name_zh;
  let allDesc = isZh ? desc_zh || desc : desc || desc_zh;
  allDesc = allDesc && allDesc.replace('��', '');

  return (

    <div className={styles.searchEBListContent}>
      <a href={`https://gct.aminer.cn/eb/gallery/detail/eb/${id}?key=${query}`} target="_blank" className="eb_title">
        <div className="logo">
          <img src={logo || 'https://static.aminer.cn/misc/eb/nomal.jpg'} alt={name} />
        </div>
      </a>
      <div className="ebInfo">
        <div className="title">
          <a href={`https://gct.aminer.cn/eb/gallery/detail/eb/${id}?key=${query}`} target="_blank">
            <div>{name}</div>
          </a>
          <div className="right">
            {matched && person_count &&
              <span className="total">
                <FM id="aminer.gct.related.talents"
                  defalutMessage="Related talents"
                  values={{
                    number: <em className="figure">{person_count}</em>
                  }}
                />
              </span>
            }
          </div>

        </div>
        <div className="otherInfo">
          {stats && stats.n_member && (
            <span className="member">
              {/* 收录学者：{stats.n_member} 位 */}
              <FM id="aminer.gct.inclusion.scholar"
                defalutMessage="Inclusion scholar: "
                values={{
                  number: stats.n_member
                }}
              />
            </span>
          )}
          {time && stats && stats.n_member && (
            <span className="split" />
          )}
          {time && (
            <span>
              {formatMessage({ id: 'aminer.gct.updated', defaultMessage: 'Update time: ' })}
              {moment(time).format('YYYY-MM-DD')}
            </span>
          )}
        </div>
        <div className="desc" style={{ WebkitBoxOrient: 'vertical' }}
          dangerouslySetInnerHTML={{ __html: allDesc }} />
      </div>
    </div>

  );
};

export default (React.memo(SearchEBList));
