import React, { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';
import { component, connect, Link } from 'acore';
import { Button } from 'antd';
import consts from 'consts';
import { FM } from 'locales';
import * as profileUtils from 'utils/profile-utils';
import { NE } from 'utils/compare';
import styles from './PersonAwards.less';
import { formatMessage } from '@/locales';

const silverPath = `${consts.ResourcePath}/sys/aminer/icon/silver.png`;
const goldenPath = `${consts.ResourcePath}/sys/aminer/icon/golden.png`;

const PersonAwards = props => {
  const [awards, setAwards] = useState();
  const { personId, dispatch } = props;
  let unmounted = false;

  useEffect(() => {
    const getAwardTags = () => {
      dispatch({
        type: 'profile/getAllAwards',
        payload: {
          pid: personId,
          person_id: personId,
          recent_10: true,
          year: 2019,
        },
      }).then(({ old_awards = [], new_awards = [] }) => {
        if (!unmounted && (old_awards || new_awards)) {
          const top10 = [];
          const top100 = [];
          new_awards.forEach(item => {
            const { domain_id } = item;
            const is_top10 = item.rank <= 10;
            const is_top100 = item.rank <= 100;
            const award_icon = is_top10 ? goldenPath : silverPath;
            const award_class = is_top10 ? 'golden' : 'silver';
            const t = {
              domain: item.domain_name,
              year: '2020',
              award_icon,
              award_class,
              route: 'ai2000',
              is_top10,
              domain_id,
            };
            if (!is_top100) {
              return;
            }
            if (is_top10) {
              top10.push(t);
            } else {
              top100.push(t);
            }
          });
          old_awards.forEach(item => {
            const arr =
              item.l && item.l.replace(/AI-10 ?/g, '').split('Most Influential Scholar Award in ');
            const is_top10 = item.l && item.l.indexOf('Top 10') >= 0;
            const award_icon = is_top10 ? goldenPath : silverPath;
            const award_class = is_top10 ? 'golden' : 'silver';
            const route = item.l.startsWith('2018') ? 'ai10' : 'mostinfluentialscholar';
            const year = item.l && item.l.split(' ')[0];
            const domain_id = item.i.split('#')[0];
            const t = {
              domain: arr[1],
              year,
              award_icon,
              award_class,
              route,
              is_top10,
              domain_id,
            };
            if (is_top10) {
              top10.push(t);
            } else {
              top100.push(t);
            }
          });

          const list = [...top10, ...top100];
          setAwards(list);
        }
      });
      // dispatch({
      //   type: 'aminerAI10/getPersonAwardsById',
      //   payload: {
      //     person_id: aid,
      //     recent_10: true,
      //   },
      // });
    };
    getAwardTags();
    // 这个modal的管理是否可以再整理一下.
    return () => {
      unmounted = true;
      dispatch({ type: 'modal/close' });
    };
  }, [personId]);

  const loadMore = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.person.awards', defaultMessage: 'Awards' }),
        extraArticleStyle: { padding: '20px 30px' },
        content: <AwardsInfo awards={awards} />,
      },
    });
  };

  const defaultAwards = useMemo(() => awards && awards.filter(item => item.year !== '2018'), [
    awards,
  ]);
  const year2018Awards = useMemo(() => awards && awards.filter(item => item.year === '2018'), [
    awards,
  ]);

  if (!awards) {
    return false;
  }

  return (
    <div className={styles.awardsInfo}>
      {(!defaultAwards || defaultAwards.length === 0) &&
        year2018Awards &&
        year2018Awards.length > 0 && (
          <>
            <p className={styles.infoTitle}>
              <span>
                <FM id="aminer.person.awards" defaultMessage="Awards" />
                <FM id="aminer.common.colon" defaultMessage=": " />
              </span>
            </p>
            <AwardsInfo awards={year2018Awards} />
          </>
        )}
      {defaultAwards && defaultAwards.length > 0 && (
        <>
          <p className={styles.infoTitle}>
            <span>
              <FM id="aminer.person.awards" defaultMessage="Awards" />
              <FM id="aminer.common.colon" defaultMessage=": " />
            </span>
            <span className={styles.loadmore} onClick={loadMore}>
              <FM id="aminer.person.awards.loadmore" defaultMessage="More Awards" />
            </span>
          </p>
          <AwardsInfo awards={defaultAwards} />
        </>
      )}
    </div>
  );
};
export default component(
  connect(({ auth, aminerPerson }) => ({
    profile: aminerPerson.profile,
    auth,
    user: auth.user,
  })),
)(PersonAwards);

const AwardsInfo = props => {
  const { awards } = props;
  if (!awards || awards.length === 0) {
    return false;
  }
  return (
    <div>
      {awards.map(award => {
        const { award_class, award_icon, route, year, is_top10, domain, domain_id } = award;
        return (
          <div key={domain_id} className={classnames(styles.award_line, styles[award_class])}>
            <img src={award_icon} alt="" />
            <Link to={`/${route}/${domain_id}`}>
              {year === '2020' && (
                <span>{`2020 AI 2000 Most Influential Scholar Award ${
                  is_top10 ? '' : 'Honorable Mention'
                } in `}</span>
              )}
              {year !== '2020' && (
                <span>{`${year} AMiner ${
                  is_top10 ? 'Top 10 ' : ''
                }Most Influential Scholar Award in `}</span>
              )}
              <strong>{domain}</strong>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
// 2018 AMiner Top 10 Most Influential Scholar Award in Artificial Intelligence
// const getPerson = () => {
//   dispatch({ type: 'aminerPerson/getPerson', payload: { ids: [personId] } })
// }

// const showAwards = () => {
//   dispatch({
//     type: 'modal/open',
//     payload: {
//       title: formatMessage({ id: 'aminer.person.awards', defaultMessage: 'Awards' }),
//       extraArticleStyle: { padding: '20px 30px' },
//       content: <AwardsInfo awards={awards} />
//     }
//   })
// }

// return (
//   <div className={styles.profile_awards}>
//     {awards && awards.length > 0 && (
//       <p
//         className="profile_award"
//         onClick={showAwards}
//       >
//         <span className={styles.label}>
//           <FM id="aminer.person.awards" defaultMessage="Awards" />
//           <FM id="aminer.common.colon" defaultMessage=": " />
//         </span>
//         {awards.slice(0, 3).map(award => {
//           const award_icon = award.l.indexOf('Top 10') >= 0 ? goldenPath : silverPath
//           return (
//             // <li className="award">
//             //   <img key={award.i} src={award_icon} alt="" />
//             //   <span className="award_desc">{award.l}</span>
//             // </li>
//             <img key={award.i} src={award_icon} alt="" />
//           )
//         })}
//       </p>
//     )}
//   </div>
// )
