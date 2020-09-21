import React, { useMemo, Fragment } from 'react';
import helper, { getLangLabel } from 'helper';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { classnames } from 'utils';
import styles from './Information.less';

interface IPropType {
  person: ProfileInfo;
  extraInfo: Array<{ icon: string; text?: string; value?: string; conditions?: string[] }>;
  shorthand: boolean;
}

const Information: React.FC<IPropType> = props => {
  const { person, extraInfo = [], shorthand } = props;

  const { profile } = person || {};

  const position = getLangLabel(profile?.position, profile?.position_zh);
  const affiliation = getLangLabel(profile?.affiliation, profile?.affiliation_zh);

  const infos = useMemo(
    () => [{ icon: 'bao', text: position }, { icon: 'lacale', text: affiliation }, ...extraInfo],
    [extraInfo, person],
  );

  return (
    <div className={classnames(styles.information, { [styles.shorthand]: shorthand })}>
      {infos?.map((info, index) => {
        const { icon, text, value, conditions } = info;
        const isShow = !conditions || conditions?.every(condition => !!person[condition]);
        const label = text || (value && person && person[value]);
        return (
          <Fragment key={text || icon}>
            {isShow && (text || (value && person && person[value])) && (
              <>
                {!shorthand && (
                  <p className="person_info_item">
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref={`#icon-${icon}`} />
                    </svg>
                    {label}
                  </p>
                )}
                {shorthand && (
                  <span className="person_info_item">
                    <span>{label}</span>
                    {/* {index !== infos.length - 1 && <span>, </span>} */}
                  </span>
                )}
              </>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Information;
