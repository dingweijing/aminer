import React from 'react';
import { Radio } from 'antd';
import { Loading } from 'components/ui';
import { FM } from 'locales';

const TimeRank = (props) => {
  const { onTopRankTimeChange, topRankTime, topRankLoading } = props;
  return (
    <div className="topRankTime">
      <Radio.Group onChange={onTopRankTimeChange} value={topRankTime}>
        <Radio value={'all'}>
          <FM id='aminer.channel.all' />
        </Radio>
        <Radio value={'recent'}>
          <FM id='aminer.channel.recent' />
        </Radio>
      </Radio.Group>
      {topRankLoading && <Loading fatherStyle="loading" />}
    </div>
  )
}

export default TimeRank
