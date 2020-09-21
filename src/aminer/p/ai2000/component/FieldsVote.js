import React from 'react';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import ConfVote from './ConfVote';
import styles from './FieldsVote.less';

const FieldsVote = props => {
  const { domainInfo, y, vote_id } = props;
  const langKey = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';
  if (!domainInfo) {
    return false;
  }
  return (
    <ul className={styles.list}>
      {domainInfo &&
        domainInfo.map(field => (
          <li key={field.id} className="award_item">
            <span>{field[langKey]}</span>
            <div className="desc">
              {field.jconfs &&
                field.jconfs.length > 0 &&
                field.jconfs.map(jconf => (
                  <p
                    key={jconf.full_name}
                    className={classnames('jconf', {
                      spare: jconf && jconf.status && !jconf.status[`${y}`],
                    })}
                  >
                    <span className="jconf_name">{`${jconf.full_name} ${
                      jconf.short_name ? `(${jconf.short_name})` : ''
                    }`}</span>
                    <ConfVote
                      vote_id={vote_id}
                      conf_id={jconf.vote_id_map && jconf.vote_id_map[`${y}`]}
                      is_vote_up={jconf.is_vote_up}
                      is_vote_down={jconf.is_vote_down}
                      vote_up_num={jconf.vote_up_num}
                      vote_down_num={jconf.vote_down_num}
                      year={y}
                    />
                  </p>
                ))}
            </div>
          </li>
        ))}
    </ul>
  );
};

export default FieldsVote;
