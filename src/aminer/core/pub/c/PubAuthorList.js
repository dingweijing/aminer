import React from 'react';
import { component, Link } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import display from 'utils/display';
import { getProfileUrl } from 'utils/profile-utils'
import { ExpertLink } from 'aminer/components/widgets';
import styles from './PubAuthorList.less';

// TODO refactor...
const PubAuthorList = props => {
  const {
    personList: persons,
    imgSrcWidth = '90',
    imgBoxStyle = {
      width: '70px',
      minWidth: '70px',
      height: '80px'
    },
    enableImgLazyLoad, className,
  } = props;

  return (
    <div className={classnames(styles[className], styles.personList)}>

      {persons && persons.map(person => {
        const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);
        const imgprops = {
          src: enableImgLazyLoad ? display.DefaultAvatar : avatar,
        }

        const { name, name_zh, id, indices, profile } = person;
        const nameText = name && name_zh ? `${name} (${name_zh})` : `${name || name_zh || ''}`;

        const authorlink = getProfileUrl(name, id);

        return (
          <div className={styles.carousel} key={person.id || nameText}>
            <div className={styles.imgBox} style={imgBoxStyle}>
              <img {...imgprops} alt={nameText} />
            </div>
            <div className={styles.content}>
              <div className={styles.title}>
                {id && (
                  <ExpertLink author={person}>
                    <Link to={authorlink}>
                      <strong>{nameText}</strong>
                    </Link>
                  </ExpertLink>
                )}
                {!id && (
                  <span>
                    <strong>{nameText}</strong>
                  </span>
                )}
              </div>

              {indices && (
                <p className={styles.statsLine}>
                  {!!indices.hindex && (
                    <>
                      <span><em>h</em>-index：</span>
                      <span className={styles.statst}>{indices.hindex}</span>

                    </>
                  )}

                  {!!indices.hindex && !!indices.pubs && (
                    <span className={styles.split}>|</span>
                  )}

                  {!!indices.pubs && (
                    <>
                      <FM id="aminer.common.paper" defaultMessage="#Paper" />：
                        <span className={styles.statst}>{indices.pubs}</span>
                    </>
                  )}

                  {!!indices.pubs && !!indices.citations && (
                    <span className={styles.split}>|</span>
                  )}

                  {!!indices.citations && (
                    <>
                      <FM id="aminer.common.citation" defaultMessage="#Citation" />：
                        <span className={styles.statst}>{indices.citations}</span>
                    </>
                  )}
                </p>
              )}

              {profile && profile.position && (
                <p>
                  {/* <i className="fa fa-briefcase" /> */}
                  <span>{profile.position}</span>
                </p>
              )}

              {profile && profile.affiliation && (
                <p>
                  {/* <i className="fa fa-bank" /> */}
                  <span>{profile.affiliation}</span>
                </p>
              )}

            </div>

          </div>

        );
      })}
    </div>
  )
}

export default component()(PubAuthorList);
