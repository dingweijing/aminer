import React from 'react';
import classnames from 'classnames';
// import * as profileUtils from 'utils/profile-utils';
import { FM } from 'locales'
import ResumeCard from '../ResumeCard';
import styles from './resume.less';

const AcmCitations = props => {
  const { acm_citations } = props;

  return (
    <ResumeCard
      enableEdit={false}
      title="ACM_Citations"
    >
      {acm_citations && acm_citations.length > 0 && (
        <ul className={styles.citations}>
          {acm_citations.map(item => {
            const { citation, country, id, year } = item
            return (
              <li className="citation" key={id}>
                <p className="country">
                  {country && (<span>{country}</span>)}
                  {country && year && (<span>-</span>)}
                  {year && (<span>{year}</span>)}
                </p>
                {citation && (<p className="cit">{citation}</p>)}
              </li>
            )
          })}
        </ul>
      )}
      {(!acm_citations || acm_citations.length === 0) && (
        <div className={styles.citations}>
          <FM id="aminer.common.none" defaultMessage="None" />
        </div>
      )}
    </ResumeCard>

  );
}
export default AcmCitations;

// const citation = profileUtils.displayCitation(profile.acm_citations);

// const country = profileUtils.displayCountry(profile.acm_citations);
// const year = profileUtils.displayYear(profile.acm_citations);

// <>
//   {profile && (
//     <div className={classnames(styles.profile_info, 'container-wrong')}>
//       <div className={styles.info_zone}>
//         <div className={styles.title}><h2><i className="fa fa-book fa-fw" /> ACM Citations</h2>
//         </div>
//         <div className={styles.spliter} />
//         <div className={styles.expert_basic_info_left}>
//           {country && year && <p> {country} - {year} </p>}
//           {citation && <p className={styles.italic}> {citation} </p>}
//         </div>
//       </div>
//     </div>
//   )}
// </>
