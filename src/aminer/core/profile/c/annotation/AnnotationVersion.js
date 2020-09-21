import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import moment from 'moment';
import { classnames } from 'utils';
import { Button, message, Popconfirm } from 'antd';
import { BasicTable } from 'amg/ui/table';
import AnnotationVersionConfim from './AnnotationVersionConfim';
import styles from './AnnotationVersion.less';

const linkText = {
  homepage: '个人主页',
  hp: '官方主页',
  gs: 'google scholar',
  dblp: 'dblp',
  position: '职称',
}

const AnnotationVersion = props => {
  const { id, dispatch } = props;
  const [allLog, setAllLog] = useState([]);
  let unmounted = false;

  useEffect(() => {
    dispatch({
      type: 'editProfile/getPersonAnnotationVersion',
      payload: { aid: id }
    })
      .then((data) => {
        console.log(data);
        !unmounted && setAllLog(data && data.versions || []);
      })
    return () => {
      unmounted = true;
    }
  }, [id])

  const showField = (data, fields, changing_data) => {
    return fields && fields.map((n, m) => {
      const field = n && n.split('.') || [];
      const classStyle = {
        className: classnames(styles.filedSplit, styles.filedBorder)
      }
      if (n === 'links') {
        return (
          Object.values(createLink(data[n], changing_data && changing_data[n])).map((i, j) => {
            return <p {...classStyle}>{i ? <a target="_blank" href={i}>{i}</a> : '-'}</p>
          })
        )
      }
      let str = data && data[field[0]];
      if (field.length > 1) {
        str = str && str[field[1]];
      }
      str = str && str.trim() ? str : '-';
      return <p {...classStyle}>{str || '-'}</p>
    })
  }

  const createLink = (oldData, newData) => {
    const data = newData || oldData;
    const linksStructrue = {};
    const { gs, resource } = data || {};
    const linkItem = resource && resource.resource_link || [];
    if (gs) { linksStructrue.gs = newData ? '' : gs && gs.url; }
    linkItem && linkItem.map(({ id, url }) => {
      linksStructrue[id] = newData ? '' : url;
    });
    return linksStructrue;
  }

  const affirmAnnotation = (version_num, affirm = false) => {
    console.log('affirmAnnotation', version_num);
    dispatch({
      type: 'editProfile/AffirmPersonAnnotation',
      payload: {
        aid: id, version_num,
        verified: true, affirm
      }
    }).then(({ judge, succeed }) => {
      console.log('data', judge, succeed);
      if (succeed) {
        if (judge) {
          affirmAnnotation(version_num, true);
          return;
        }
        message.error('成功')
      }
    })
  }

  const columns = [
    {
      Header: '标注人',
      accessor: 'c_by',
      align: 'center',
      width: 80,
      Cell: () => {
        return '张三';
      }
    },
    {
      Header: '标注过的信息',
      accessor: 'fields',
      Cell: ({ cell: { value, row } }) => {
        const { fields, changing_data, origin_data } = row && row.original || {};
        return value && value.map((n, m) => {
          const fieldItem = n && n.split('.') || [];
          if (n === 'links') {
            return Object.keys(createLink(changing_data && changing_data.links)).map((i, j) => {
              return (
                <p className={classnames(styles.filedSplit, styles.highText,
                  { [styles.filedBorder]: true })}>{linkText[i]}</p>
              )
            })
          }
          if (fieldItem.length > 1) { n = linkText[fieldItem[1]]; }
          return (
            <p className={classnames(styles.filedSplit, styles.highText,
              { [styles.filedBorder]: true })}>{n}</p>
          )
        })
      },
    },
    {
      Header: '标注前',
      accessor: 'origin_data',
      Cell: ({ cell: { row } }) => {
        const { origin_data, fields, changing_data } = row && row.original || {};
        return showField(origin_data, fields, changing_data)
      },
    },
    {
      Header: '标注后',
      accessor: 'changing_data',
      Cell: ({ cell: { row } }) => {
        const { changing_data, fields } = row && row.original || {};
        return showField(changing_data, fields)
      },
    },
    {
      Header: '时间',
      accessor: 'c_date',
      Cell: ({ cell: { value } }) => {
        return moment(value).format('YYYY-MM-DD')
      },
    },
    {
      Header: '操作',
      accessor: 'version',
      Cell: ({ cell: { value } }) => {
        return (
          <>
            <AnnotationVersionConfim version_num={value} aid={id} />
            {/* <Button type='primary' size='small'
              onClick={() => { affirmAnnotation(value) }} className={styles.oprateBtn}>确认</Button> */}
            <Button danger="true" size='small' className={styles.oprateBtn}>回滚</Button>
          </>
        )
      },
    },
  ]

  console.log('allLog', allLog[2] ? [allLog[2]] : []);
  return (
    <div className={styles.annotationVersion}>
      <div className={styles.verTitle}>标注记录</div>
      <BasicTable
        rowKey="id"
        data={allLog[0] ? [allLog[0]] : []}
        columns={columns}
      />
    </div>
  )
}

export default component(connect())(AnnotationVersion)
