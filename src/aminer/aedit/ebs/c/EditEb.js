import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { Tabs, Icon, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
import { isRoster, isPeekannotationlog } from 'utils/auth';
import { AutoForm } from 'amg/ui/form';
import { formatMessage } from 'locales';
import { EbNavbar, EbSearchFilterList } from './index';
import styles from './EditEb.less';

const formSchema = [
  {
    name: 'title',
    label: '',
    type: 'text',
  },
  {
    name: 'alias',
    label: 'Alias:https://aminer.cn/expert/',
    type: 'text',
    className: 'largeWidth',
    placeholder: 'alias',
    labelStyle: 'labelText',
  },
  {
    name: 'desc',
    type: 'textarea',
    autoSize: true,
  },
  {
    wrapperStyle: 'iconStyle',
    children: [
      {
        name: 'visibility',
        type: 'radio',
        label: 'Visibility Level (?)',
        options: [
          { label: 'Private', value: 'private' },
          { label: 'Public', value: 'public' },
        ],
        labelStyle: 'labelText',
      },
      {
        name: 'locked',
        type: 'checkbox',
        text: 'Lock',
        className: 'checkboxIcon',
      },
    ],
  },
]

const formComment = [
  {
    name: 'note',
    type: 'textarea',
    autoSize: true
  }
]

const EditEb = props => {

  const { dispatch, ebId = '5e71e8c34c775e93ef9b4f86', user } = props;
  const [notes, setNotes] = useState(null);
  // const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [ebBasic, setEbBasic] = useState({});
  const [expertList, setExpertList] = useState(null)
  const [edit, setEdit] = useState(false)
  const [noteEdit, setNoteEdit] = useState(false)

  // const userPermission = isRoster(user) || isPeekannotationlog(user);

  useEffect(() => {
    getNotes();
    getEbBasic();
    getExpertList();
  }, [ebId]);

  const getNotes = () => {
    dispatch({
      type: 'editEb/getNotesFromRosters',
      payload: { ids: [ebId] }
    }).then((v) => {
      const actUser = v && v.actUser && v.actUser[ebId] || {};
      setNotes({ actUser, note: v && v.note || '' });
    })
    // data1.note对应notes.note
  };

  const getEbBasic = () => {
    dispatch({
      type: 'editEb/getEbBasic',
      payload: { id: ebId }
    }).then((v) => {
      setEbBasic(v || {});
    })
  }

  const getExpertList = () => {
    dispatch({
      type: 'editEb/getExpertList',
      payload: { id: ebId }
    }).then((res) => {
      setExpertList(res)
    })
  }

  const editSwitch = () => {
    setEdit(!edit)
  }

  const noteEditSwitch = () => {
    setNoteEdit(!noteEdit)
  }

  const initialData = {
    title: ebBasic && ebBasic.title,
    alias: ebBasic && ebBasic.alias,
    desc: ebBasic && ebBasic.desc,
    visibility: ebBasic && ebBasic.is_public ? 'public' : 'private',
    locked: ebBasic && ebBasic.is_locked,
  }

  const SaveNote = (data, { setSubmitting }) => {
    setSubmitting(false);
    dispatch({
      type: 'editEb/SetEbNoteToRoster',
      payload: { id: ebId, note: data.note } // 绑定到输入框的值
    }).then((res) => {
      if (res) {
        message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }));
        getNotes();
        setNoteEdit(!noteEdit)
      } else { message.error('error') }
    });
  }

  const SaveBasicInfo = (data, { setSubmitting }) => {
    setSubmitting(false);
    data.public = data.visibility === 'public' ? true : false
    delete data.visibility
    const payload = { id: ebBasic.id }
    Object.keys(data)
      .filter(key => (key !== 'locked' ? data[key] !== ebBasic[key] : data[key] !== ebBasic.is_locked))
      .forEach(item => { payload[item] = data[item] })
    dispatch({
      type: 'editEb/SaveEbBasic',
      payload,
    }).then((res) => {
      if (res) {
        message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }));
        getEbBasic();
        setEdit(!edit)
      } else { message.error('error') }
    })
  }
  return (
    <div className={styles.editEb}>
      <div className={styles.basicInfo}>
        <svg className="icon titleEditIcon" aria-hidden="true" onClick={editSwitch}>
          <use xlinkHref='#icon-edit' />
        </svg>
        {
          edit ? (
            <div className={styles.editBox}>
              <a href={`https://aminer.cn/expert/${ebBasic.alias}`} target='_blank'>{`https://aminer.cn/expert/${ebBasic.alias}`}</a>
              <AutoForm
                config={formSchema}
                data={initialData}
                onSubmit={SaveBasicInfo}
              />
            </div>
          ) : (
              <>
                <h2 className={styles.title}>{ebBasic.title}</h2>
                <div className={styles.publicNote}><span>{ebBasic.is_public ? 'Public' : 'Private'}</span></div>
                <a href={`https://aminer.cn/expert/${ebBasic.alias}`} target='_blank'>{`https://aminer.cn/expert/${ebBasic.alias}`}</a>
                <div className={styles.note}>{ebBasic.desc}</div>
                <div className={styles.note}>
                  {ebBasic.creator_name && (
                    <span className={styles.iconwrap}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-researchers" />
                      </svg>
                      {ebBasic.creator_name}
                    </span>
                  )}
                  <span className={styles.iconwrap}>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-time1" />
                    </svg>
                    {ebBasic.last_updated && ebBasic.last_updated.split(' ')[0]}
                  </span>
                  <span className={styles.iconwrap}>
                    <Icon type='usergroup-add' />
                    {ebBasic.stats && ebBasic.stats.total}
                  </span>
                </div>
              </>
            )
        }
        <div className={styles.comment}>
          <>{formatMessage({ id: 'aminer.person.note', defaultMessage: 'Note' })} &nbsp;</>
          <svg className="icon commentIcon" aria-hidden="true" onClick={noteEditSwitch}>
            <use xlinkHref='#icon-edit' />
          </svg>
        </div>
        {
          noteEdit ? (
            <AutoForm
              config={formComment}
              data={{ note: notes && notes.note }}
              onSubmit={SaveNote}
            />
          ) : (
              <>
                <p>{notes && notes.note}</p>
                <div className={styles.noteName}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-researchers" />
                  </svg> {notes && notes.actUser && notes.actUser.name}
                </div>
              </>
            )
        }
      </div>
      <EbNavbar stats={ebBasic.stats} ebId={ebId} expertList={expertList} />
      <EbSearchFilterList />
    </div >
  )

}

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(EditEb) 
