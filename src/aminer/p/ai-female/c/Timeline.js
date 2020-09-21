/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { connect, component, Link } from 'acore';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { FM, formatMessage } from 'locales';
import { Timeline } from 'antd';
import styles from './Timeline.less';

const TimeLine = props => {
  const { dispatch } = props;
  const { ai10_female_data } = props;
  const { timeline } = ai10_female_data || {};
  const { timeline_desc, timeline_desc_zh } = ai10_female_data || {};

  useEffect(() => {
    if (!ai10_female_data) {
      dispatch({ type: 'aminerAI10/getFemaleOtherData' });
    }
  }, []);

  if (!timeline) {
    return false;
  }

  return (
    <section className={styles.timeline}>
      <div
        className="desc"
        dangerouslySetInnerHTML={{ __html: getLangLabel(timeline_desc, timeline_desc_zh) }}
      />
      {timeline.length > 0 && (
        <Timeline>
          {timeline
            // .slice(24)
            // .reverse()
            .map(item => (
              <Timeline.Item key={`${item.title}_${item.year}`}>
                <EventItem data={item} />
              </Timeline.Item>
            ))}
        </Timeline>
      )}
    </section>
  );
};

export default component(
  connect(({ aminerAI10 }) => ({
    ai10_female_data: aminerAI10.ai10_female_data,
  })),
)(TimeLine);

const EventItem = props => {
  const { data } = props;
  const { year, title, title_zh, url, scholar, desc, desc_zh, type, type_zh } = data;
  return (
    <div className={styles.eventItem}>
      <p className="date line">
        <span className="year">{year}</span>
        <span className="event_type">{getLangLabel(type, type_zh)}</span>
      </p>
      <p className="title line">
        {!url && <span>{getLangLabel(title, title_zh)}</span>}
        {url && (
          <a href={url} targert="_blank">
            {getLangLabel(title, title_zh)}
          </a>
        )}
      </p>
      {scholar && scholar.length > 0 && (
        <p className="scholars">
          {scholar.map((author, index) => {
            const { name, name_zh, id } = author;
            return (
              <span key={name}>
                {id && (
                  <Link className="author link" target="_blank" to={`/profile/${id}`}>
                    {getLangLabel(name, name_zh)}
                  </Link>
                )}
                {!id && <span className="author">{getLangLabel(name, name_zh)}</span>}
                {index !== scholar.length - 1 && <span>, </span>}
              </span>
            );
          })}
        </p>
      )}

      <p className="desc" dangerouslySetInnerHTML={{ __html: getLangLabel(desc, desc_zh) }}></p>
    </div>
  );
};
