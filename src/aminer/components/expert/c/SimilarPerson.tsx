import React, { PureComponent, Fragment, useState } from 'react';
import { component, connect, Link } from 'acore';
import { classnames } from 'utils';
import { getProfileUrl, getImageType } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import { FM } from 'locales';
import display from 'utils/display';
// import { Spin } from 'aminer/components/ui';
import { Spin } from 'antd';
import PersonLink from 'aminer/components/pops/person/PersonLink.tsx';
import { IAuthorBase } from 'aminer/components/common_types';
import { ProfileInfo } from 'aminer/components/person/person_type';
import styles from './SimilarPerson.less';

interface IAuthorShape extends IAuthorBase {
  shape: number;
}
interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  showAvatar: boolean;
  target: string;
  person: ProfileInfo;
}

const SimilarPerson: React.FC<IPropTypes> = props => {
  const [flag, setFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [similar, setSimilar] = useState<IAuthorShape[]>();

  const { dispatch, className } = props;
  const { person } = props;
  const { personInfocard, showAvatar, target = '_blank' } = props;

  const personSimilar = (id: string) => {
    if (!similar) {
      setLoading(true);
      dispatch({ type: 'aminerSearch/personSimilar', payload: { id } }).then(async data => {
        for (const i of data) {
          const avatar = i && display.personAvatar(i.img, 0);
          const extEndUrl = avatar.replace(/!.*\b/, '');
          const shape = await getImageType(extEndUrl);
          i.shape = shape;
        }
        setSimilar(data);
        setFlag(!flag);
        setLoading(false);
      });
    } else {
      setFlag(!flag);
    }
  };

  const similarClass = showAvatar ? 'avatar' : 'name';
  return (
    <div className={classnames(styles.similarContainer, styles[className])}>
      <div className={classnames(styles.opr, { [styles.choose]: !!similar })}>
        <div className={styles.similarBtn} onClick={personSimilar.bind(null, person.id)}>
          <FM id="aminer.person.similar.author" defaultMessage="Similar" />
          {!flag && <i className="fa fa-angle-down" />}
          {flag && <i className="fa fa-angle-up" />}
        </div>
        <Spin spinning={loading} size="small" />
      </div>

      {flag && similar && similar.length > 0 && (
        <div className={styles[similarClass]}>
          {/* <FM id='aminer.person.similar.experts' defaultMessage='Similar Experts' /><span>:</span> */}
          {similar.map(author => {
            const content = (
              <PersonLink author={author} authorTarget={target} showAvatar={showAvatar} />
            );

            let ele = null;
            if (author.id) {
              ele = (
                <ExpertLink author={author}>
                  <Link
                    id={`sid_${author.id}`}
                    className={styles.similar}
                    target={target}
                    to={getProfileUrl(author.name, author.id)}
                  >
                    {content}
                  </Link>
                </ExpertLink>
              );
            } else {
              ele = <span className={styles.similarAvatar}>{content}</span>;
            }
            return <Fragment key={author.id || author.name}>{ele}</Fragment>;
          })}
        </div>
      )}
      {flag && similar && similar.length === 0 && (
        <FM id="com.PersonList.message.noResults" defaultMessage="No Results" />
      )}
    </div>
  );
};

export default component(connect())(SimilarPerson);
