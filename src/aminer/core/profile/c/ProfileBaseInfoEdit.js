import React, { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';
import { connect, component } from 'acore';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { FM, formatMessage,getLocale } from 'locales';
import { AnnotationZone } from 'amg/zones';
import { AutoForm } from 'amg/ui/form';
import { isLogin, isRoster } from 'utils/auth';
import { getLangLabel } from 'helper';
import { getPositionMap } from 'helper/profile';
import StatusLabel from './annotation/StatusLabel';
import styles from './ProfileBaseInfoEdit.less';

const outFeild = ['gender', 'name', 'name_zh', 'language'];

const ProfileBaseInfoEdit = props => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const { dispatch, editType /* isUserLogin, canAnnyotate, ShowAnnotation */ } = props;
  const {
    pid,
    infoData,
    names,
    onSubmit,
    user,
    afterEdit,
    cancleEdit,
    passawayData = {},
  } = props;
  const { is_passedaway, can_burncandles } = passawayData || {};

  // const isAdminShow = isRoster(user);

  const formSchema = useMemo(() => {
    // if (isAdminShow) {
    return [
      {
        name: 'name',
        label: formatMessage({ id: 'aminer.person.name', defaultMessage: 'Name' }),
        type: 'text',
        rules: [{ required: true, message: '请输入姓名' }],
      },
      {
        name: 'name_zh',
        label: formatMessage({ id: 'aminer.person.name_zh', defaultMessage: 'Name_Zh' }),
        type: 'text',
      },
      {
        name: 'position',
        label: formatMessage({ id: 'aminer.person.position', defaultMessage: 'Position' }),
        type: 'select',
        config: {
          options: Object.keys(getPositionMap).map(n => ({ value: n, name: n })),
          mode: 'inputOne',
          filterProp: 'name',
        },
      },
      // {
      //   name: 'honorary',
      //   label: formatMessage({ id: 'aminer.person.honorary', defaultMessage: 'Honorary' }),
      //   type: 'checkboxGroup',
      //   options: [
      //     { label: '院士', value: '1' },
      //     { label: '长江学者', value: '2' },
      //     { label: '杰青', value: '3' },
      //     { label: '优青', value: '4' },
      //     { label: '科技新星', value: '5' },
      //   ],
      //   span: 8,
      // },
      {
        name: 'phone',
        label: formatMessage({ id: 'aminer.person.phone', defaultMessage: 'Phone' }),
        type: 'text',
      },
      {
        name: 'fax',
        label: formatMessage({ id: 'aminer.person.fax', defaultMessage: 'Fax' }),
        type: 'text',
      },
      {
        name: 'email',
        label: formatMessage({ id: 'aminer.person.email', defaultMessage: 'Email' }),
        type: 'text',
      },
      {
        name: 'affiliation',
        label: formatMessage({ id: 'aminer.person.affiliation', defaultMessage: 'Affiliation' }),
        type: 'textarea',
        autoSize: true,
      },
      {
        name: 'affiliation_zh',
        label: formatMessage({ id: 'aminer.person.affiliation_zh', defaultMessage: 'Affiliation Zh' }),
        type: 'textarea',
        autoSize: true,
      },
      {
        name: 'address',
        label: formatMessage({ id: 'aminer.person.address', defaultMessage: 'Address' }),
        type: 'textarea',
        autoSize: true,
      },
      {
        name: 'homepage',
        label: formatMessage({ id: 'aminer.person.homepage', defaultMessage: 'Homepage' }),
        type: 'text',
      },
      {
        name: 'hp',
        label: formatMessage({ id: 'aminer.person.official homepage', defaultMessage: 'official Homepage' }),
        type: 'text',
      },
      {
        name: 'gs',
        label: formatMessage({ id: 'aminer.person.google_url', defaultMessage: 'Google' }),
        type: 'text',
      },
      {
        name: 'dblp',
        label: 'dblp',
        type: 'text',
      },
      {
        name: 'gender',
        label: formatMessage({ id: 'aminer.person.gender', defaultMessage: 'Gender' }),
        type: 'select',
        config: {
          options: [
            { value: '', name: formatMessage({ id: 'aminer.person.unknown', defaultMessage: 'UNKNOWN' }) },
            { value: 'male', name: formatMessage({ id: 'aminer.regiest.gender.male', defaultMessage: 'Male' }) },
            { value: 'female', name: formatMessage({ id: 'aminer.regiest.gender.female', defaultMessage: 'Female' }) },
          ],
        },
      },
      {
        name: 'language',
        label: formatMessage({ id: 'aminer.person.lang', defaultMessage: 'Lang' }),
        type: 'select',
        config: {
          options: [
            { value: '', name: 'Unknown' },
            { value: 'chinese', name: 'Chinese' },
            { value: 'english', name: 'English' },
            { value: 'greek', name: 'Greek' },
            { value: 'german', name: 'German' },
            { value: 'french', name: 'French' },
            { value: 'japanese', name: 'Japanese' },
            { value: 'indian', name: 'Indian' },
            { value: 'korean', name: 'Korean' },
            { value: 'italian', name: 'Italian' },
            { value: 'portuguese', name: 'Portuguese' },
          ],
          filterProp: 'name',
        },
      },
    ];

  }, []);

  const formData = useMemo(() => {
    const { position, position_zh, ...param } = infoData;
    param.email = email || '';
    let pos = position && getPositionMap[position] && getPositionMap[position][getLocale()];
    pos = pos ? pos : getLangLabel(position, position_zh);
    param.position = pos;
    return { ...param, ...names };
  }, [email, infoData, names, loading]);

  useEffect(() => {
    if (pid) {
      dispatch({
        type: 'profile/GetPersonEmail',
        payload: {
          id: pid,
        },
      }).then(el => {
        // console.log('el', el)
        setEmail(el);
        setLoading(false);
      });
    }
  }, [pid]);

  // const baseData = { ...infoData, ...names } || {};

  const updatePerson = profile => {
    const updated = Object.keys(profile).filter(item => profile[item] !== formData[item] && !['gs', 'hp', 'dblp'].includes(item));
    const fields = updated.map(item => ({
      field: outFeild.includes(item) ? item : `profile.${item}`,
      value: profile[item],
    }));
    if (updated && updated.length > 0 && updated.indexOf('position') !== -1) {
      fields.push({ field: 'profile.position_zh', value: '' })
    }
    const resource_link = Object.keys(profile)
      .filter(item => item === 'hp' || item === 'dblp')
      .map(item => ({
        url: profile[item],
        id: item,
      }))
    const links = {
      gs: {
        "id": "",
        "type": "gs",
        "url": profile.gs,
        "creator": user.name,
      },
      resource: { resource_link, }
    }
    fields.push({ field: 'links', value: links });
    dispatch({
      type: 'editProfile/UpsertPersonAnnotation',
      payload: {
        id: pid,
        fields,
        force_update: isRoster(user),
      },
    }).then((data) => {
      if (data) {
        if (profile.name !== formData.name || profile.name_zh !== formData.name_zh) {
          dispatch({
            type: 'profile/setProfileInfo',
            payload: {
              name: profile.name,
              name_zh: profile.name_zh,
            },
          });
        }
        message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }));
        afterEdit && afterEdit(profile);
      } else {
        message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
      }
    })
      .catch((error) => {
        message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
      });
  };

  const Submit = (profile, { setSubmitting }) => {
    setSubmitting(false);
    if (onSubmit) {
      onSubmit(profile)
        .then(result => {
          if (result) {
            updatePerson(profile);
          } else {
            message.info('请等待管理员审核...');
          }
        })
        .catch(() => {
          message.info('合并错误,请联系管理员...');
        });
    } else {
      if (typeof (profile.position) !== 'string') { // 保证pos字段的值类型为字符串
        profile.position = profile.position[0] || '';
      }
      updatePerson(profile);
    }
  };

  const onCancle = () => {
    if (cancleEdit) {
      cancleEdit();
    }
  };

  if (Object.keys(formData).length === 0) {
    return false;
  }

  return (
    <div className={styles.profileBaseInfoEdit} >
      <AutoForm
        config={formSchema}
        data={formData}
        mode="edit"
        editorStyle='baseEditorStyle'
        onSubmit={Submit}
      />

      {!loading && isRoster(user) && !editType && passawayData && (
        <AnnotationZone>
          <StatusLabel pid={pid} is_passedaway={is_passedaway} can_burncandles={can_burncandles} />
        </AnnotationZone>
      )}
    </div>
  );
};

export default component(
  connect(({ auth, aminerPerson, editProfile }) => ({
    profile: aminerPerson.profile,
    user: auth.user,
    // flags
    isUserLogin: auth.isUserLogin, // 是否已经登录
    // canAnnotate: auth.canAnnotate, // 是否可以标注
    // ShowAnnotation: debug.ShowAnnotation,
    passawayData: editProfile.passawayData,
  })),
)(ProfileBaseInfoEdit);

/*
{
      wrapperStyle: 'nameLine', // 多个FormItem包裹的样式
      children: [
        {
          name: 'name11',
          type: 'text',
          label: '中文名',
          editorStyle: '', // Input的样式
          className: '',   // FormItem的样式
        },
        {
          name: 'name12',
          type: 'text',
          label: '英文名',
          rules: [{ required: true }]
        },
      ]
    },
    {
      name: 'name2',
      type: 'text',
      label: '测试',
      render: (props) => {
        return (
          <div className='test'>
            <FormItem {...props} />
            <span>其他标签</span>
          </div>
        )
      },
    },
*/
