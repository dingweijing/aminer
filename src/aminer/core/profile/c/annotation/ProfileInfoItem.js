import React, { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';
import { connect, component } from 'acore';
import { message } from 'antd';
import { getLangLabel } from 'helper';
import { FM, formatMessage } from 'locales';
import { getProfileInfo } from 'helper/profile';
import { AutoForm } from 'amg/ui/form';
import styles from './ProfileInfoItem.less';

// const createInfo = (person) => {
//   const { indices = {}, profile = {}, name, name_zh } = person;
//   if (profile) {
//     return {
//       position: profile.position || '',
//       affiliation: profile.affiliation || '',
//       phone: profile.phone || '',
//       homepage: profile.homepage || '',
//       fax: profile.fax || '',
//       address: profile.address || '',
//       language: profile.lang || '',
//       gender: profile.gender || '',
//       email: profile.email || '',
//       name, name_zh,
//     }
//   }
//   return {};
// }

const ProfileInfoItem = props => {
  const [email, setEmail] = useState('');
  const [infoData, setInfoData] = useState(getProfileInfo(props.data));
  const { dispatch, data } = props;
  const pid = data && data.id;

  const formSchema = useMemo(() => {
    return [
      {
        name: 'name',
        label: formatMessage({ id: 'aminer.person.name', defaultMessage: 'Name' }),
        type: 'show',
        rules: [{ required: true, message: '请输入姓名' }],
      },
      {
        name: 'name_zh',
        label: formatMessage({ id: 'aminer.person.name_zh', defaultMessage: 'Name_Zh' }),
        type: 'show',
      },
      {
        name: 'pos',
        label: formatMessage({ id: 'aminer.person.position', defaultMessage: 'Position' }),
        type: 'show',
      },
      {
        name: 'phone',
        label: formatMessage({ id: 'aminer.person.phone', defaultMessage: 'Phone' }),
        type: 'show',
      },
      {
        name: 'fax',
        label: formatMessage({ id: 'aminer.person.fax', defaultMessage: 'Fax' }),
        type: 'show',
      },
      {
        name: 'email',
        label: formatMessage({ id: 'aminer.person.email', defaultMessage: 'Email' }),
        type: 'show',
      },
      {
        name: 'affiliation',
        label: formatMessage({ id: 'aminer.person.affiliation', defaultMessage: 'Affiliation' }),
        type: 'show',
        autoSize: true,
      },
      {
        name: 'affiliation_zh',
        label: formatMessage({ id: 'aminer.person.affiliation_zh', defaultMessage: 'Affiliation Zh' }),
        type: 'show',
      },
      {
        name: 'address',
        label: formatMessage({ id: 'aminer.person.address', defaultMessage: 'Address' }),
        type: 'show',
      },
      {
        name: 'homepage',
        label: formatMessage({ id: 'aminer.person.homepage', defaultMessage: 'Homepage' }),
        type: 'show',
      },
      {
        name: 'hp',
        label: formatMessage({ id: 'aminer.person.official homepage', defaultMessage: 'official Homepage' }),
        type: 'show',
      },
      {
        name: 'gs',
        label: formatMessage({ id: 'aminer.person.google_url', defaultMessage: 'Google' }),
        type: 'show',
      },
      {
        name: 'dblp',
        label: 'dblp',
        type: 'show',
      },
      {
        name: 'gender',
        label: formatMessage({ id: 'aminer.person.gender', defaultMessage: 'Gender' }),
        type: 'show',
      },
      {
        name: 'language',
        label: formatMessage({ id: 'aminer.person.lang', defaultMessage: 'Lang' }),
        type: 'show',
      },
    ];
  }, []);

  const formData = useMemo(() => {
    const { position, position_zh, ...param } = infoData;
    param.pos = getLangLabel(position, position_zh);
    param.email = email || '';
    return param;
  }, [email, infoData]);

  useEffect(() => {
    if (pid) {
      dispatch({
        type: 'profile/GetPersonEmail',
        payload: {
          id: pid
        }
      }).then(el => {
        setEmail(el);
      })
    }
  }, [pid])

  if (Object.keys(formData).length === 0) {
    return false
  }

  return (
    <div className={styles.profileInfoItem}>
      <AutoForm
        config={formSchema}
        data={formData}
        editorStyle='baseEditorStyle'
        mode="edit"
      />
    </div>
  );
}

export default component(connect())(ProfileInfoItem)
