import React, { useEffect, useState, useRef } from 'react';
import { connect, component, Link } from 'acore';
import { classnames } from 'utils';
import display from 'utils/display';
import consts from 'consts';
import { FM } from 'locales';
import { NE } from 'utils/compare';
import { getProfileUrl, getImageType } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import { Spin } from 'aminer/components/ui';
import styles from './ProfileSimilarAuthors.less';

const resRoot = process.env.NODE_ENV === 'production' ? '/static' : '';

const ProfileSimilarAuthors = props => {
  const [similars, setSimilars] = useState([]);
  const destroy = useRef(false);
  const { dispatch, personId, profileSimilar, profileSimilarID } = props;
  useEffect(() => {
    // console.log('getProfileSimilar !!!!')
    getProfileSimilar()
    return () => {
      destroy.current = true
    }
  }, [personId])

  useEffect(() => {
    // console.log('set loading sim', `profileSimilarID: ${profileSimilarID}`, `personId: ${personId}`)
    if (profileSimilar && !consts.IsServerRender() && profileSimilarID === personId) {
      //  && profileSimilarID === personId
      // console.log('handleImgShape !!')
      if (!destroy.current) {
        setSimilars(profileSimilar)
      }
      handleImgShape()
    }
  }, [profileSimilar])

  const handleImgShape = async () => {
    const newSimilars = [...profileSimilar]
    const reqList = newSimilars.map(item => {
      const avatar = item && display.personAvatar(item.img, 0);
      const extEndUrl = avatar.replace(/!.*\b/, '');
      return getImageType(extEndUrl, 1)
    })
    Promise.all(reqList)
      .then(results => {
        results.forEach((item, index) => {
          newSimilars[index].shape = item;
        })
        if (!destroy.current) {
          setSimilars(newSimilars);
        }
      })
  }

  const getProfileSimilar = () => {
    dispatch({ type: 'aminerPerson/getProfileSimilar', payload: { personId } })
  }

  const showName = (text, length) => {
    let f = '';
    let n = '';
    if (text) {
      const arr = text.split(' ');
      f = arr.splice(arr.length - 1)
      n = arr.map(item => item.slice(0, 1).toUpperCase()).join('')
    }
    const name = `${n} ${f[0]}`;
    // if (text) {
    //   if (text.length > length) {
    //     name = `${text.substring(0, length)}...`;
    //   } else {
    //     name = text;
    //   }
    // }
    // return `${name.substring(0, 8)}...`;
    return name;
  };

  const personEvent = person => {
    console.log('personEvent------------', person);
    // 点击图片调api  true 然后跳转到对应的profile页面
    // https://api.aminer.cn/api/event/person/sim  post 返回true 接着跳转到新的profile页面
    // { aid: urlid, sid: person.id, mid: person.mid  }
  };

  const goProfilePage = item => {
    dispatch({ type: 'profile/getProfileInfoSuccess', payload: { data: item } })
  }

  if (!similars || similars.length === 0) {
    return false
  }

  return (
    <div className={styles.similarPart}>
      <div className={styles.title}>
        <FM id="aminer.person.similar.author" defaultMessage="Similar Authors" />
      </div>
      <div className={styles.content}>
        {/* <Spin loading={!profileLoading && loading} time={0} /> */}
        <ul className={styles.similarPersons}>
          {similars && similars.length > 0 && similars.map((person, index) => {
            const img = display.personAvatar(person.img, 0, '80');
            const ele = (
              <>
                <div className={styles.personImg}>
                  <span className={styles.helper} />
                  <img className={classnames({ [styles.autoWidth]: person.shape })} src={img} alt="" />
                </div>
                {person.mid === '1' && (
                  <p className={classnames(styles.mid_1, styles.name)}>
                    {showName(person.name, 8)}
                  </p>
                )}
                {person.mid === '0' && (
                  <p className={classnames(styles.mid_0, styles.name)}>
                    {showName(person.name, 8)}
                  </p>
                )}
              </>
            )
            return (
              <li className={classnames({ [styles.photo_wrap_last]: index % 4 === 3 })}
                key={`${person.id}+${person.name}`}>
                {person.id && (
                  <ExpertLink author={person}>
                    <Link className={styles.similarAvatar}
                      to={getProfileUrl(person.name, person.id)}
                    >
                      {ele}
                    </Link>
                  </ExpertLink>
                )}
                {!person.id && (
                  <span className={styles.similarAvatar}>
                    {ele}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>

  );
}
export default component(connect(({ aminerPerson, loading }) => ({
  profileSimilar: aminerPerson.profileSimilar,
  profileSimilarID: aminerPerson.profileSimilarID,
  // loading: loading.effects['aminerPerson/getProfileSimilar'],
  // profileLoading: loading.effects['profile/getProfileBaseData'],
})))(ProfileSimilarAuthors)
