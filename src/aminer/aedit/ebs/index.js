import React, { useState, useEffect, useCallback } from 'react';
import { page, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { Auth } from 'acore/hoc';
import { parseUrlParam, routeTo } from 'helper';
import { ExpertbaseTree, EbBasicInfo, EbSearchFilter } from './c';
import styles from './index.less';

const AllEb = props => {
  const [eb, setEb] = useState(null);
  const { id } = parseUrlParam(props, {}, ['id']);

  const { dispatch, treeData } = props;

  useEffect(() => {
    init();
  }, [id]);

  useEffect(() => {
    if (treeData && treeData[0]
      && treeData[0].id && !id) {
      routeTo(props, { id: treeData[0].id });
      console.log('getDatass', treeData);
    }
  }, [treeData]);

  const init = () => {
    if (id) {
      dispatch({
        type: 'expertbaseTree/getExpertBases', payload: { ids: [id] },
      }).then((item) => {
        setEb(item);
      });
    }
  };

  const onItemClick = useCallback((aid) => {
    routeTo(props, { id: aid });
  }, []);

  return (
    <Layout showSearch showHeader>
      <div className={styles.ebs}>
        <div className={styles.leftSlider}>
          <ExpertbaseTree key={100}
            onItemClick={onItemClick}
            selected={id}
          />
        </div>
        <div className={styles.content}>
          <EbBasicInfo eb={eb} />
          <EbSearchFilter id={id} />
        </div>
      </div>
    </Layout>
  )
}

export default page(connect(({ expertbaseTree }) => ({
  treeData: expertbaseTree.treeData
})))(AllEb)



















// const TabConfig = {
//   myEb: {
//     key: <FM id="aminer.dashboard.menu.expertbase" />,
//     content: () => {
//       return 'my eb'
//     },
//   },
//   publicEb: {
//     key: (
//       <>
//         <svg className="icon" aria-hidden="true">
//           <use xlinkHref="#icon-dianziqikan" />
//         </svg>
//         {formatMessage({ id: "annotation.aedit.publiceb", defaultMessage: "Public Expert Bases" })}
//       </>
//     ),
//     content: () => <EditEb />
//   },
//   create: {
//     key: (
//       <>
//         <Icon type='file-add' />
//         {formatMessage({ id: "aminer.dashboard.annotation.create", defaultMessage: "Create Expert Base" })}
//       </>
//     ),
//     content: () => <NewEb />
//   },
//   createAdvEb: {
//     key: (
//       <>
//         <Icon type='file-add' />
//         {formatMessage({ id: "annotation.aedit.advpubliceb", defaultMessage: "Create Advanced Expert Base" })}
//       </>
//     ),
//     content: () => <NewEb type='advance' />
//   },
// };
