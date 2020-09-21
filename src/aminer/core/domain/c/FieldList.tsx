import React, { useEffect, useState, useRef, Fragment } from 'react';
import { component, connect, Link } from 'acore';
import { classnames } from 'utils';
import consts from 'consts';
import { getLangLabel } from 'helper';
import { FM, formatMessage, zhCN } from 'locales';
import { IChannelItem } from 'aminer/components/common_types';
import { IFollow } from 'aminer/p/user/notification_types';
import { sysconfig } from 'systems';
import styles from './FieldList.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  fields: IChannelItem[];
}

const colors = [
  'rgba(92, 30, 121, .8)',
  'rgba(41, 36, 90, .8)',
  'rgba(44, 41, 42, .8)',
  'rgba(219, 151, 90, .8)',
  'rgba(255, 106, 0, .8)',
  'rgba(79, 71, 171, .8)',
  'rgba(49, 64, 119, .8)',
  'rgba(19, 139, 110, .8)',
  'rgba(0, 14, 40, .8)',
];

const FieldList: React.FC<IPropTypes> = props => {
  const { fields } = props;

  const getDisplayName = (en_label: string, zh_label: string) => {
    let en = en_label || '', zh = zh_label || '';
    const isZh = sysconfig.Locale === zhCN;
    if (isZh) {
      return (
        <Fragment>
          {zh && <div className="display_name_zh">{zh}</div>}
          {en && <div className="display_name_en">{en}</div>}
        </Fragment>
      )
    }
    return en || zh || '';
  }

  return (
    <div className={classnames(styles.fieldList, 'field-list')}>
      {!!fields?.length &&
        fields.map((field, index) => {
          const { display_name, domain_id, stats } = field;
          const { en, cn } = display_name;
          const { paperCount, jconfTotal } = stats;
          return (
            <div key={domain_id} className="field_item">
              <div className="name_wrapper_bg"
                style={{
                  backgroundImage: `url(${`${consts.ResourcePath}/data/channel/channel_bg.png`})`,
                }}
              >
                <Link
                  to={`/channel/${domain_id}`}
                  target="_blank"
                >
                  <div className="name_wrapper" style={{ backgroundColor: colors[index % 9] }}>
                    <div className="display_name">{getDisplayName(en, cn)}</div>
                  </div>
                </Link>
              </div>
              <div className="count_wrapper">
                <span className="pubs" title={formatMessage({id: 'aminer.channel.field.paperCount'})}>
                  {!!paperCount && (
                    <>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-text" />
                      </svg>
                      <span className="split"></span>
                      <span className="count">{paperCount.toLocaleString() || ''}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          )
        })}
    </div>
  );
};

export default component(connect())(FieldList);
