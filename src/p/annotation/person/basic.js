/**
 * Created by bo gao on 2019-05-17
 * Refactor: Use Hooks.
 */
import React, { useEffect } from 'react';
import { connect, page, Link } from 'acore';
import { sysconfig } from 'systems';
import { Layout } from 'layouts';
import { FM } from 'locales';
import { PersonBasicEditor } from 'p/core/person/c/edit';
// import ExpertBaseSearch from 'components/eb/ExpertBaseSearch';
// import EBBasicInfo from 'components/eb/EBBasicInfo';
// import ExpertbaseTree from 'components/eb/ExpertbaseTree';
// import { EBSuperTabs } from 'components/eb/supertab';
import { Auth } from 'acore/hoc';
import { classnames } from 'utils';
// import { syncUrlParamToState, routeTo } from 'helper';
import * as authutil from 'utils/auth';
// import { compare } from 'utils/compare';
import styles from './basic.less';
// import { FormCreate } from '@/acore';

const thepage = props => {
  const { roles } = props;

  return (
    <Layout
      classNames={[styles.layout, sysconfig.EB_LayoutSkin]}
      searchZone={[]}
      rightZone={[]}
      contentClass=""
      showSidebar
      showNavigator={false}
    // sidebar={[(
    //   <ExpertbaseTree key={100}
    //     onItemClick={this.onItemClick}
    //     onReady={this.onTreeReady}
    //     selected={id}
    //   />
    // )]}
    >

      <div className={styles.container}>
        <h1>Person Basic Contact Annotation Tool.</h1>
        <Link to="/annotation/person/5405d5bedabfae450f3d7dcc" >Person Basic Contact Annotation Tool.</Link>

        <PersonBasicEditor
          className={styles.editor}
          personId="5405d5bedabfae450f3d7dcc" // bo gao
        // personId="53f48041dabfae963d25910a" // qiang yang

        />

      </div>
    </Layout>
  );
};

export default page(
  connect(({ auth }) => ({
    roles: auth.roles,
  })),
  Auth,
)(thepage);
