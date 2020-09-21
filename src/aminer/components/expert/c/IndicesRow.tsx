import React from 'react';
import { FM, } from 'locales';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { classnames } from 'utils';
import styles from './IndicesRow.less';

interface IPropType {
  person: ProfileInfo;
  target: '_blank' | 'self';
  site: number;
  showBind: boolean;
  isCrosswise: boolean;
  extraStat: Array<{ label: string; count: number }>;
}

const IndicesRow: React.FC<IPropType> = props => {
  const { statistic, extraStat, site = 0, isCrosswise } = props;

  const { hindex, citations, pubs } = statistic || {};

  return (
    <div className={classnames(styles.indicesRow, 'indices-row', { [styles.column]: !isCrosswise })}>
      {!site &&
        !!extraStat?.length &&
        extraStat.map((stat_item, index) => {
          const { label, count } = stat_item;
          return (
            <span key={label} className={classnames('stat_item', `stat_item${index}`)}>
              {label}
              <FM id="aminer.common.colon" defaultMessage=": " />
              <span className="statst">{count || 0}</span>
            </span>
          );
        })}
      <span className="stat_item">
        <span>
          <em>h</em>-index
        </span>
        <FM id="aminer.common.colon" defaultMessage=": " />
        <span className="statst">{hindex || 0}</span>
      </span>
      <span className="stat_item">
        <FM id="aminer.common.paper" defaultMessage="#Paper" />
        <FM id="aminer.common.colon" defaultMessage=": " />
        <span className="statst">{pubs || 0}</span>
      </span>
      <span className="stat_item">
        <FM id="aminer.common.citation" defaultMessage="#Citation" />
        <FM id="aminer.common.colon" defaultMessage=": " />
        <span className="statst">{citations || 0}</span>
      </span>
      {!!site &&
        !!extraStat?.length &&
        extraStat.map((stat_item, index) => {
          const { label, count } = stat_item;
          return (
            <span key={label} className={classnames('stat_item', `stat_item${index}`)}>
              {label}
              <FM id="aminer.common.colon" defaultMessage=": " />
              <span className="statst">{count || 0}</span>
            </span>
          );
        })}
    </div>
  );
};

export default IndicesRow;
