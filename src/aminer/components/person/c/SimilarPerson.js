import React, { PureComponent, Fragment, useState } from 'react';
import { component, connect, Link } from 'acore';
import { classnames } from 'utils';
import { getProfileUrl, getImageType } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import { FM } from 'locales';
import PropTypes from 'prop-types';
import display from 'utils/display';
// import { Spin } from 'aminer/components/ui';
import { Spin } from 'antd';
import styles from './SimilarPerson.less';

const SimilarPerson = props => {
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similar, setSimilar] = useState(null);

  const { dispatch, className } = props;
  const { person } = props;
  const { personInfocard, infocardShow, infocardHide, showAvatar, isAuthorOuter } = props;

  const personSimilar = id => {
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

  const handlePersonInfocard = (id, pid) => {
    if (personInfocard) {
      personInfocard(id, pid);
    }
  };

  const handleInfocardShow = (sid, pid) => {
    const target = document.querySelector(`#pid_${pid} #sid_${sid}`);
    if (infocardShow) {
      infocardShow(target, sid);
    }
  };

  const handleInfocardHide = () => {
    if (infocardHide) {
      infocardHide();
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
            const similarAvatar = display.personAvatar(author.img, 0, 80);
            const content = showAvatar ? (
              <img
                alt=""
                src={similarAvatar}
                className={classnames({ [styles.autoWidth]: author.shape })}
              />
            ) : (
              <span>{author.name}</span>
            );

            let ele = null;
            if (author.id) {
              ele = (
                <ExpertLink author={author}>
                  <Link
                    id={`sid_${author.id}`}
                    className={styles.similar}
                    target={isAuthorOuter ? '_blank' : '_self'}
                    to={getProfileUrl(author.name, author.id)}
                    onMouseEnter={e => {
                      infocardShow(
                        { sid: author.id, e },
                        {
                          y: 50,
                        },
                      );
                    }}
                    onMouseLeave={infocardHide}
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
SimilarPerson.propTypes = {
  showAvatar: PropTypes.bool,
  isAuthorOuter: PropTypes.bool,
};
SimilarPerson.defaultProps = {
  showAvatar: true,
  isAuthorOuter: false,
};
export default component(connect())(SimilarPerson);
