import React from 'react';
import { Link } from 'acore';
import helper from 'helper';
import { getProfileUrl } from 'utils/profile-utils';
import { ProfileInfo } from 'aminer/components/person/person_type';
import styles from './PersonName.less';
import { classnames } from 'utils/';

interface IPropType {
  person: ProfileInfo;
  target: '_blank' | 'self';
  showBind: boolean;
}

const renderNames = (name?: string, nameZh?: string) => {
  const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
  const nameBlock = (
    <span className="profileName">
      <span className="name">{mainName}</span>
      {subName && (
        <span className="sub">{isDefaultLocale ? `（${subName}）` : `(${subName})`}</span>
      )}
    </span>
  );
  const nameText = isDefaultLocale ? `${mainName}（${subName}）` : `${mainName} (${subName})`;
  return { nameBlock, nameText };
};

const PersonName: React.FC<IPropType> = props => {
  const { person, target, showBind } = props;

  const { nameBlock } = renderNames(person?.name, person?.name_zh);

  const ele = <strong>{nameBlock}</strong>;

  return (
    <div className={styles.personName}>
      <div className="person_name">
        {person.id && (
          <Link to={getProfileUrl(person.name, person.id)} target={target}>
            {ele}
          </Link>
        )}
        {!person.id && <span>{ele}</span>}
        {showBind && (
          <span className={classnames('bind_icon', { bind: person.bind })}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-bind" />
            </svg>
          </span>
        )}

        {/* {person.id && COVIDHotExpert && COVIDHotExpert.includes(person.id) && (
          <a
            className="covid"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://lfs.aminer.cn/misc/COVID-19Experts/${person.id}.pdf`}
          >
            <FM id="aminer.person.covid" defaultMessage="COVID-19 HOT Expert" />
          </a>
        )} */}
      </div>
    </div>
  );
};

export default PersonName;
