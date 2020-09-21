import React, { useMemo, memo } from 'react';
import { FM, formatMessage } from 'locales';

const DomainDesc = props => {
  const { pageData, nameLang, y, isRecent } = props;
  const { jconfs, year_author_num_map, year_paper_num_map } = pageData || {};

  const confs = useMemo(() => {
    const names =
      jconfs &&
      jconfs
        .filter(item => item && item.status && item.status[y])
        .map(item => `${item.full_name}(${item.short_name})`);
    if (!names || names.length === 0) {
      return '';
    }
    if (names.length === 1) {
      return names[0];
    }
    if (names.length === 2) {
      return `${names[0]} ${formatMessage({ id: 'ai10.field.conference.and' })} ${names[1]}`;
    }
    if (names.length > 2) {
      return names
        .map((name, index) => {
          return index === names.length - 1
            ? ` ${formatMessage({ id: 'ai10.field.conference.with' })} ${name}`
            : `${name}${
            index === names.length - 2
              ? ''
              : formatMessage({ id: 'ai10.field.conference.parataxis' })
            }`;
        })
        .join('');
    }
    return '';
  }, [jconfs]);
  return (
    <FM
      id="ai2000.field.desc"
      tagName="div"
      values={{
        conf: confs,
        type: isRecent
          ? formatMessage({
            id: 'ai2000.type.last10',
            defaultMessage: 'in the last 10 years',
          })
          : formatMessage({
            id: 'ai2000.type.history',
            defaultMessage: 'throughout history',
          }),
        author_num: year_author_num_map[y] || 26488,
        paper_num: year_paper_num_map[y] || 12871,
        field: pageData[nameLang],
      }}
    />
  );
};

export default memo(DomainDesc);
