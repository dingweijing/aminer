import React, { useEffect, useState } from 'react';
import { Tabs, Input } from 'antd';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import styles from './Bibtex.less';

const Bibtex = props => {
  const { dispatch, id } = props;
  const [cited, setCited] = useState();
  const [bibtex, setBibtex] = useState();

  useEffect(() => {
    dispatch({
      type: 'aminerSearch/bibtex',
      payload: { id }
    }).then((info) => {
      setBibtex(info && info.data);
    })
    dispatch({
      type: 'pub/getTopicCited',
      payload: { ids: [id] },
    }).then((data) => {
      setCited(data);
    })
  }, []);

  const getBibtexData = data => data.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')

  const { bib, mla, apa } = bibtex || {};

  return (
    <div className={classnames('aminer-tab', styles.bibContent)}>
      <Tabs type="card" defaultActiveKey="1">
        <Tabs.TabPane tab="BIB" key="1">
          {cited && cited.bib && (
            <Input.TextArea value={cited.bib} autoSize disabled />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="CITE" key="2">
          <div className="bibtex-content">
            {mla && mla.data && (
              <div className="part">
                <p className="bibTitle">MLA:</p>
                <div dangerouslySetInnerHTML={{ __html: getBibtexData(mla.data) }} />
              </div>
            )}
            {apa && apa.data && (
              <div className="part">
                <p className="bibTitle">APA:</p>
                <div dangerouslySetInnerHTML={{ __html: getBibtexData(apa.data) }} />
              </div>
            )}
            {cited && cited.chicago && (
              <div className="part">
                <p className="bibTitle">Chicago:</p>
                <div dangerouslySetInnerHTML={{ __html: getBibtexData(cited.chicago) }} />
              </div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
export default component(connect())(Bibtex);
