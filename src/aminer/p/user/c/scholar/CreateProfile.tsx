import React, { useEffect, useState, useMemo } from 'react';
import { component, connect, history } from 'acore';
import { classnames } from 'utils';
import { Popconfirm, message } from 'antd';
import { FM, formatMessage } from 'locales';
import { FormComponentProps } from 'antd/lib/form/Form';
import { AutoForm } from 'amg/ui/form';
import { IUser } from 'aminer/components/common_types';
import { Spin } from 'aminer/components/ui';
import { ProfileInfo } from 'aminer/components/person/person_type';
import ProfileInfoPanel from './ProfileInfoPanel';
import styles from './CreateProfile.less';

interface IPropTypes extends FormComponentProps {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  user: IUser;
  loading: boolean;
}

const CreateProfile: React.FC<IPropTypes> = props => {
  const { dispatch, user, setIsBind } = props;
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
        // rules: [{ type: 'email', message: '' }]
      },
      {
        name: 'affiliation',
        label: formatMessage({ id: 'aminer.person.affiliation', defaultMessage: 'Affiliation' }),
        type: 'textarea',
        autoSize: { minRows: 1, maxRows: 3 },
      },
      // {
      //   name: 'affiliation_zh',
      //   label: formatMessage({
      //     id: 'aminer.person.affiliation_zh',
      //     defaultMessage: 'Affiliation Zh',
      //   }),
      //   type: 'textarea',
      //   autoSize: { minRows: 1, maxRows: 3 },
      // },
      {
        name: 'address',
        label: formatMessage({ id: 'aminer.person.address', defaultMessage: 'Address' }),
        type: 'textarea',
        autoSize: { minRows: 1, maxRows: 3 },
      },
      {
        name: 'homepage',
        label: formatMessage({ id: 'aminer.person.homepage', defaultMessage: 'Homepage' }),
        type: 'text',
      },
      // {
      //   name: 'gender',
      //   label: formatMessage({ id: 'aminer.person.gender', defaultMessage: 'Gender' }),
      //   type: 'select',
      //   config: {
      //     options: [
      //       {
      //         value: '',
      //         name: formatMessage({ id: 'aminer.person.unknown', defaultMessage: 'UNKNOWN' }),
      //       },
      //       {
      //         value: 'male',
      //         name: formatMessage({ id: 'aminer.regiest.gender.male', defaultMessage: 'Male' }),
      //       },
      //       {
      //         value: 'female',
      //         name: formatMessage({ id: 'aminer.regiest.gender.female', defaultMessage: 'Female' }),
      //       },
      //     ],
      //   },
      // },
    ];
  }, []);

  const onBindProfile = (params: ProfileInfo) => {
    dispatch({
      type: 'social/BindProfile',
      payload: params,
    }).then(res => {
      if (res.status) {
        message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }));
        // localStorage.removeItem('lc_aminer_me-data');
        setTimeout(() => {
          // setIsBind(res?.aid || '');
          history.push('/user/scholar');
        }, 500);
      } else {
        message.error(res?.message || '');
      }
    });
  };

  const Submit = (values: ProfileInfo) => {
    onBindProfile(values);
  };

  const formInitData = useMemo(() => {
    return {
      name: user?.name,
      email: user?.email,
    };
  }, [user]);

  return (
    <div className={classnames(styles.createProfile, 'create-profile')}>
      <ProfileInfoPanel
        profile={user}
        isGotoProfile={false}
        // bottomZone={bottomZone}
        title={formatMessage({ id: 'aminer.user.bind.create.title' })}
      >
        <div className="create_form">
          <AutoForm
            config={formSchema}
            data={formInitData}
            mode="edit"
            editorStyle="baseEditorStyle"
            onSubmit={Submit}
          />
        </div>
      </ProfileInfoPanel>
    </div>
  );
};

export default component(
  connect(({ auth, profile, loading }) => ({
    user: auth.user,
    // profilePubs: profile.profilePubs,
    // loading: loading.effects['profile/getPersonPapers'],
  })),
)(CreateProfile);
