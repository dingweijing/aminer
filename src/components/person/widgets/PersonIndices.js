/* eslint-disable camelcase */
/**
 *  Created by BoGao on 2017-07-4;
 */
import React from 'react';
import { Tooltip } from 'antd';
import { classnames } from 'utils/index';
import { sysconfig } from 'systems';
import styles from './PersonIndices.less';

const indicesConfig = {
  // relevance: { key: 'relevance', letter: 'R', tooltip: '搜索相关度（R）', color: 'blue' },
  h_index: {
    key: 'hindex',
    letter: 'H',
    tooltip: '学术成就H-index（H）',
    texttip: '学术成就',
    color: 'h_index',
    render: (indices) => {
      return indices.hindex || indices.h_index || 0;
    },
  },
  activity: {
    key: 'activity',
    letter: 'A',
    tooltip: '学术活跃度（A）',
    color: 'activity',
    render: (indices) => {
      return indices.activity && indices.activity.toFixed(2);
    },
  },
  rising_star: { // Actually this is newStar.
    key: 'newStar',
    letter: 'S',
    tooltip: '领域新星（S）',
    color: 'new_star',
    render: (indices) => {
      return (indices.newStar && indices.newStar.toFixed(2)) || 0;
    },
  },
  citations: {
    key: 'citations',
    letter: 'C',
    tooltip: '引用数（C）',
    texttip: '引用数',
    color: 'num_citation',
  },
  num_pubs: {
    key: 'pubs',
    letter: 'P',
    tooltip: '论文数（P）',
    texttip: '论文数',
    color: 'num_pubs',
  },
  activityRankingContrib: {// special for ccf.
    key: 'activity-ranking-contrib',
    letter: 'C',
    color: 'blue',
    tooltip: 'CCF活动贡献（C）',
    render: (activity, activity_indices) => {
      if (activity.activityRankingContrib || activity.activityRankingContrib === 0) {
        return activity.activityRankingContrib;
      } else {
        return activity_indices && activity_indices.contrib && activity_indices.contrib.toFixed(2);
      }
    },
  },
  growth: {
    key: 'growth',
    letter: 'G',
    tooltip: '成长值（G)',
    texttip: '成长值',
    color: 'num_pubs',
    render: (indices, activity_indices) => {
      const wh = indices.growth ? (1 - indices.growth) * 100 : 0;
      return (
        <div className='box'>
          <div className='range' style={{ width: wh }} />
        </div>
      );
    },
  },
};

const defaultIndices = sysconfig.Person_DefaultIndices || ['activity-ranking-contrib', 'h_index', 'activity', 'rising_star', 'citations', 'num_pubs'];

/**
 * @param indices - indices node from person.
 * showItems - TODO use this to config which indices to show.
 */
const PersonIndices = ({ indices, style, activity_indices, showIndices, indicesType }) => {
  if (!indices) return false;
  let indicesKeys = defaultIndices;
  if (showIndices && showIndices.length > 0) {
    indicesKeys = showIndices;
  }
  return (
    <div className={classnames(styles.personIndices, 'person-indices')} style={style}>
      {indicesKeys && indicesKeys.length > 0 &&
      indicesKeys.map((key) => {
        const ic = indicesConfig[key];
        if (!ic) {
          return '';
        } else if (!indices[ic.key]) {
          return '';
        }
        if (indicesType === 'text') {
          return (
            <div key={ic.letter}>
                <span className='text'>
                  <span>{ic.texttip} :</span>
                  <span className='textNum'>
                    {ic.render ? ic.render(indices, activity_indices) : indices[ic.key]}
                  </span>
                </span>
            </div>
          );
        } else {
          if (ic.key === 'growth') {
            return (
              <Tooltip key={ic.key} placement="top" title={`${ic.tooltip}：${indices[ic.key]}`}>
                <span className={classnames('score', `${ic.color}`)}>
                  <span className='l'>{ic.letter}</span>
                  {ic.render ? ic.render(indices, activity_indices) : indices[ic.key]}
                </span>
              </Tooltip>
            );
          } else {
            return (
              <Tooltip key={ic.key} placement="top" title={ic.tooltip}>
                <span className={classnames('score', `${ic.color}`)}>
                  <span className='l'>{ic.letter}</span>
                  <span className='r'>
                    {ic.render ? ic.render(indices, activity_indices) : indices[ic.key]}
                  </span>
                </span>
              </Tooltip>
            );
          }
        }
      })}
    </div>
  );
};

export default PersonIndices;
