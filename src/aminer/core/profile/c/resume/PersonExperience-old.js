import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { component, connect, Link } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales'
import { isLogin, isLockAuth, isBianYiGeToken } from 'utils/auth';
import { Modal, message, Button } from 'antd';
import { classnames } from 'utils';
import ResumeCard from '../ResumeCard';
import { PersonExperienceEdit } from 'aminer/core/profile/c/annotation';
import styles from './resume.less';

const formatInitDate = (result) => {
  const s = result.date && result.date.s && result.date.s.substr(0, 7);
  const start = s && s.split('-') || [];
  let sy = start[0] && Number(start[0])
  let sm = start[1] && Number(start[1]);

  const e = result.date && result.date.e && result.date.e.substr(0, 7);
  const end = e && e.split('-') || [];
  let ey = '', em = '', isworkhere = e && e.startsWith('1970-01');
  if (!isworkhere) {
    ey = end[0] && Number(end[0]) || '';
    em = end[1] && Number(end[1]) || ''
  }
  return { sy, sm, ey, em, isworkhere }
}

const createInitData = (result) => {
  if (result) {
    const { sy, sm, ey, em, isworkhere } = formatInitDate(result);
    console.log('createInitData', ey);
    return {
      aff: result.aff && result.aff.inst && (result.aff.inst.n_zh || result.aff.inst.n) || '',
      pos: result.aff && result.aff.dept && ((result.aff.dept.n_zh || result.aff.dept.n)) || '',
      date_s_y: sy || '', date_s_m: sm || '', isworkhere,
      date_e_y: ey, date_e_m: em,
      field: result.field && (result.field.n_zh || result.field.n) || '',
      desc: result.desc || '',
      weid: result.id,
    }
  } else {
    return {
      aff: '',
      pos: '',
      date_s_y: '',
      date_s_m: '',
      date_e_y: '',
      date_e_m: '',
      isworkhere: false,
      field: '',
      desc: '',
      weid: '',
    }
  }
}

const PersonExperience = props => {
  const { experience, user, dispatch, lock, pid } = props;
  const [edit, setEdit] = useState(false);
  const [weid, setWeid] = useState('');
  const [editExperience, setEditExperience] = useState(experience);

  useEffect(() => {
    setEditExperience(experience)
  }, [experience])

  const showLogin = () => {
    dispatch({ type: 'modal/login' })
  }

  const toggleEdit = () => {
    if (!edit && pid) {
      dispatch({
        type: 'editProfile/createExperience',
        payload: { id: pid },
      }).then((weid) => {
        if (weid) {
          setWeid(weid);
        }
      })
    }
    edit && setWeid('');
    setEdit(!edit)
  }

  const updateExperience = ({ tid, ...params }, needRefresh) => {
    let taskId = tid || weid;
    if (!taskId) {
      message.warning('something is error'); return
    }
    dispatch({
      type: 'editProfile/updateExperience',
      payload: {
        id: pid, weid: taskId, ...params
      },
    }).then(() => {
      if (needRefresh) { refreshExperience() }
    })
  };

  const refreshExperience = () => {
    dispatch({
      type: 'editProfile/getExperienceById',
      payload: { ids: [pid] }
    }).then((items) => {
      setEditExperience(items);
    })
  }

  const closeEdit = (closeModal, noRefresh) => {
    !noRefresh && refreshExperience();
    if (closeModal) { dispatch({ type: 'modal/close' }); }
    if (weid) { // 表示是当前新建的关闭
      setEdit(!edit);
      setWeid('');
    }
  }

  const isUserEdit = () => {
    if (lock) {
      if (isLockAuth(user)) {
        Modal.error({
          content: '请解锁后修改'
        })
      } else {
        Modal.error({
          content: '信息已被锁不能修改，请联系 feedback@aminer.cn'
        })
      }
      return false;
    }
    return true
  }

  const openEdit = (n, e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    dispatch({
      type: 'modal/open',
      payload: {
        title: '更新个人经历',
        height: '400px',
        width: '500px',
        content: <PersonExperienceEdit closeEdit={closeEdit} onSubmit={updateExperience} data={createInitData(n)} />
      }
    });
  }

  const deleteItem = (taskId) => {
    dispatch({
      type: 'editProfile/deleteExperience',
      payload: { id: pid, weid: taskId }
    }).then((info) => {
      if (info) {
        refreshExperience()
      }
    })
  }

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure delete?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => { deleteItem(id) },
    });
  }

  const rightEditBtn = useCallback((n) => {
    return (
      <Button type="primary" size='small' ghost onClick={openEdit.bind(this, n)} className="edit">
        <FM id="aminer.common.edit" defaultMessage='edit' />
      </Button>
    )
  }, [])

  return (
    <ResumeCard
      enableEdit={isLogin(user) && !isBianYiGeToken(user)}
      condition={isUserEdit}
      toggleEdit={toggleEdit}
      edit={edit}
      rightIconType='add'
      title={formatMessage({ id: 'aminer.person.experience', defaultMessage: 'Experience' })}
      leftIcon={
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-bao" />
        </svg>
      }
    >
      {edit && (<PersonExperienceEdit closeEdit={closeEdit} onSubmit={updateExperience} data={createInitData()} />)}
      {isLogin(user) && editExperience && editExperience.length > 0 && (
        <ul className={styles.experiences}>
          {editExperience.map((result, i) => (
            <Fragment key={`${result.id}+${i}`}>
              {((result.aff && result.aff.inst && (result.aff.inst.n || result.aff.inst.n_zh)) ||
                (result.aff && result.aff.dept && (result.aff.dept.n || result.aff.dept.n_zh)) ||
                (result.date && (result.date.s || result.date.e)) ||
                result.desc || result.field
              ) && (
                  <li className="experience">
                    <div className='rightBtn'>
                      {rightEditBtn(result)}
                      {/* <svg className='icon deleteBtn' aria-hidden="true" onClick={confirmDelete.bind(this, result.id)}>
                        <use xlinkHref="#icon-modal_close" />
                      </svg> */}
                      <Button size='small' type="primary" className='deleteBtn' ghost onClick={confirmDelete.bind(this, result.id)}>
                        <FM id="aminer.paper.comment.delete" defaultMessage='delete' />
                      </Button>
                    </div>
                    {result.aff && result.aff.inst && (
                      <div className="aff_inst">
                        {result.aff.inst.i && result.aff.inst.n && result.aff.inst.i !== '552e0adfdabfae7de9e566a0' && (
                          <Link target="_blank"
                            to={`/institution/${result.aff.inst.n}/${result.aff.inst.i}`}
                          >
                            {(result.aff.inst.n || result.aff.inst.n_zh) && (
                              <h5>
                                <strong>{result.aff.inst.n_zh || result.aff.inst.n}</strong>
                                {/* {rightEditBtn(result)} */}
                              </h5>
                            )}
                          </Link>
                        )}
                        {(!result.aff.inst.i || !result.aff.inst.n || result.aff.inst.i === '552e0adfdabfae7de9e566a0') && (
                          <>
                            {(result.aff.inst.n || result.aff.inst.n_zh) && (
                              <h5>
                                <strong>{result.aff.inst.n_zh || result.aff.inst.n}</strong>
                                {/* {rightEditBtn(result)} */}
                              </h5>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* aff.dept */}
                    {result.aff && result.aff.dept && (
                      <div className="aff_dept">
                        {result.aff.dept.i && (
                          // a(ui-sref="institution.homepage({name:result.aff.dept.n,id:result.aff.dept.i})")
                          <Link target="_blank"
                            to={`/institution/${result.aff.dept.n}/${result.aff.dept.i}`}
                          >
                            {(result.aff.dept.n || result.aff.dept.n_zh) && (
                              <>
                                <span>{result.aff.dept.n_zh || result.aff.dept.n}</span>
                                {/* {rightEditBtn(result)} */}
                              </>
                            )}
                            {/* {result.aff.dept.n_zh && (
                        <span>{result.aff.dept.n_zh}</span>
                      )}
                      {result.aff.dept.n && !result.aff.dept.n_zh && (
                        <span>{result.aff.dept.n}</span>
                      )} */}
                          </Link>
                        )}
                        {!result.aff.dept.i && (
                          <span>
                            {(result.aff.dept.n || result.aff.dept.n_zh) && (
                              <>
                                <span>{result.aff.dept.n_zh || result.aff.dept.n}</span>
                                {/* {rightEditBtn(result)} */}
                              </>
                            )}
                            {/* {result.aff.dept.n_zh && (
                        <span>{result.aff.dept.n_zh}</span>
                      )}
                      {result.aff.dept.n && !result.aff.dept.n_zh && (
                        <span>{result.aff.dept.n}</span>
                      )} */}
                          </span>
                        )}
                      </div>
                    )}

                    {result.date && (result.date.s || result.date.e) && (
                      <div className="date">
                        {result.date.s.indexOf('1970-01') < 0 && (
                          <span>{result.date.s.split('T')[0] && result.date.s.split('T')[0].substr(0, 7)}</span>
                        )}
                        {/* result.date.s === '1970-01' */}
                        {result.date.s.startsWith('1970-01') && (
                          <FM id="aminer.person.unknown" defaultMessage="UNKNOWN" />
                        )}
                        {result.date.e.indexOf('1970-01') < 0 && (
                          <>
                            <span>&nbsp;~&nbsp;</span>
                            <span>{result.date.e.split('T')[0] && result.date.e.split('T')[0].substr(0, 7)}</span>
                          </>
                        )}
                        {result.date.e.startsWith('1970-01') && (
                          <>
                            <span>&nbsp;~&nbsp;</span>
                            <FM id="aminer.person.present" defaultMessage="Present" />
                          </>
                        )}
                        {/* {rightEditBtn(result)} */}
                      </div>
                    )}

                    {result.desc && (
                      <div className="desc">
                        <span>{formatMessage({ id: 'aminer.annotation.description', defaultMessage: 'description' })}: {result.desc}</span>
                        {/* {rightEditBtn(result)} */}
                      </div>
                    )}
                    {result.field && (result.field.n || result.field.n_zh) && (
                      <div className="field">
                        <span>{formatMessage({ id: 'aminer.person.field', defaultMessage: 'Field' })}: {result.field.n || result.field.n_zh}</span>
                        {/* {rightEditBtn(result)} */}
                      </div>
                    )}

                  </li>
                )}
            </Fragment>
          )
          )}
        </ul>

      )}
      {isLogin(user) && (!editExperience || editExperience.length === 0) && (
        <div className={styles.experience}>
          <FM id="aminer.common.none" defaultMessage="None" />
        </div>
      )}
      {!isLogin(user) && (
        <div className={styles.experience} onClick={showLogin}>
          <span className={styles.login}>
            <FM id="aminer.common.loginview" defaultMessage="Sign in to view more" />
          </span>
        </div>
      )}
    </ResumeCard>

  )
}

PersonExperience.propTypes = {
  // experience: PropTypes.string
};

PersonExperience.defaultProps = {

}


export default component(connect(({ auth }) => ({
  user: auth.user,
  roles: auth.roles,
})))(PersonExperience)


// {experience && experience.length > 0 && (
//   <div className={styles.experience}>
//     {experience.map(result => {
//       return (<>
//         {/* aff.inst */}
//         {result.aff && result.aff.inst && (
//           <div>
//             {result.aff.inst.i && result.aff.inst.i !== '552e0adfdabfae7de9e566a0' && (
//               <span>
//                 <Link target="_blank"
//                   to={`institution/${result.aff.inst.n}/${result.aff.inst.i}`}
//                 >
//                   {(result.aff.inst.n || result.aff.inst.n_zh) && (
//                     <h5>
//                       {result.aff.inst.n_zh && (
//                         <strong>{result.aff.inst.n_zh || result.aff.inst.n}</strong>
//                       )}
//                       {/* {result.aff.inst.n_zh && (
//                         <strong>{result.aff.inst.n_zh}</strong>
//                       )}
//                       {!result.aff.inst.n_zh && result.aff.inst.n && (
//                         <strong>{result.aff.inst.n}</strong>
//                       )} */}
//                     </h5>
//                   )}
//                 </Link>
//               </span>
//             )}
//             {(!result.aff.inst.i || result.aff.inst.i === '552e0adfdabfae7de9e566a0') && (
//               <>
//                 {(result.aff.inst.n || result.aff.inst.n_zh) && (
//                   <h5>
//                     {result.aff.inst.n_zh && (
//                       <strong>{result.aff.inst.n_zh}</strong>
//                     )}
//                     {!result.aff.inst.n_zh && result.aff.inst.n && (
//                       <strong>{result.aff.inst.n}</strong>
//                     )}
//                   </h5>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/* aff.dept */}
//         {result.aff && result.aff.dept && (
//           <div>
//             {result.aff.dept.i && (
//               // a(ui-sref="institution.homepage({name:result.aff.dept.n,id:result.aff.dept.i})")
//               <Link target="_blank"
//                 to={`institution/${result.aff.dept.n}/${result.aff.dept.i}`}
//               >
//                 {(result.aff.dept.n || result.aff.dept.n_zh) && (
//                   <span>{result.aff.dept.n_zh || result.aff.dept.n}</span>
//                 )}
//                 {/* {result.aff.dept.n_zh && (
//                   <span>{result.aff.dept.n_zh}</span>
//                 )}
//                 {result.aff.dept.n && !result.aff.dept.n_zh && (
//                   <span>{result.aff.dept.n}</span>
//                 )} */}
//               </Link>
//             )}
//             {!result.aff.dept.i && (
//               <span>
//                 {(result.aff.dept.n || result.aff.dept.n_zh) && (
//                   <span>{result.aff.dept.n_zh || result.aff.dept.n}</span>
//                 )}
//                 {/* {result.aff.dept.n_zh && (
//                   <span>{result.aff.dept.n_zh}</span>
//                 )}
//                 {result.aff.dept.n && !result.aff.dept.n_zh && (
//                   <span>{result.aff.dept.n}</span>
//                 )} */}
//               </span>
//             )}
//           </div>
//         )}

//         {result.date && (result.date.s || result.date.e) && (
//           <div>
//             {result.date.s.indexOf('1970-01') < 0 && (
//               <span>{result.date.s}</span>
//             )}
//             {/* result.date.s === '1970-01' */}
//             {result.date.s.startsWith('1970-01') && (
//               <FM id="aminer.person.unknown" defaultMessage="UNKNOWN" />
//             )}
//             {result.date.e.indexOf('1970-01') < 0 && (
//               <span>{result.date.e}</span>
//             )}
//             {result.date.e.startsWith('1970-01') && (
//               <>
//                 <span>&nbsp;~&nbsp;</span>
//                 <FM id="aminer.person.present" defaultMessage="Present" />
//               </>
//             )}
//           </div>
//         )}


//         {result.desc && (
//           <span>{result.desc}</span>
//         )}
//         {result.field && (
//           <span>{result.field.span}</span>
//         )}

//       </>)
//     })}
//   </div>

// )}
