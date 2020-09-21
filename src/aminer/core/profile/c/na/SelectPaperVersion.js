import React, { useState, Fragment } from 'react';
import { Modal, Checkbox, message } from 'antd';
import { component, connect } from 'acore';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import { AnnotationZone } from 'amg/zones';
import { AffirmPaper } from '../annotation';

const SelectPaperVersion = props => {
  const { id, dispatch, pid, index, checkPaperVersion } = props;
  const [papers, setPapers] = useState();
  const [selectPaper, setSelectPaper] = useState({});

  const openModal = () => {
    dispatch({
      type: 'pub/getPaperVersion',
      payload: { id }
    }).then((items) => {
      if (!items || items && items.length === 1 && items[0].id === id) {
        message.success('当前论文只有一个版本'); return;
      }
      setPapers(items);
    })
  }

  const Ok = () => {
    if (selectPaper && !selectPaper.id) {
      message.error('请选择一个');
      return;
    }
    checkPaperVersion(index, selectPaper);
    updatePubByVersion();
    Cancle();
  }

  const updatePubByVersion = () => {
    dispatch({
      type: 'pub/updatePubByVersion',
      payload: { "pub_id": id, "version_id": selectPaper.id }
    })
  }

  const Cancle = () => {
    setPapers(null);
    setSelectPaper({});
  }

  return (
    <>
      <a onClick={openModal}>查看</a>
      {papers && papers.length > 0 &&
        <Modal
          title="选择论文版本"
          visible={true}
          onOk={Ok}
          onCancel={Cancle}
        >
          <PublicationList id="selectPaperPaper"
            showAuthorCard={false}
            papers={papers}
            abstractLen={80}
            showInfoContent={[]}
            titleLinkDomain
            isAuthorsClick={false}
            contentRightZone={[({ paper, index }) => {
              const { authors } = paper;
              const authorsID = (authors && authors.map(author => author.id)) || [];
              return (
                <Fragment key={paper.id}>
                  {authorsID.includes(pid) && (
                    // <span>已确认</span>'
                    <div className="cont">
                      <Checkbox checked disabled />
                      <AnnotationZone>
                        <AffirmPaper aid={pid} pid={paper.id} flags={paper.flags} lock={lock}
                        />
                      </AnnotationZone>
                    </div>
                  )}
                  {!authorsID.includes(pid) && (
                    <Checkbox
                      checked={selectPaper.id === paper.id}
                      onChange={(e) => { setSelectPaper(e.target.checked ? paper : {}) }}
                    />
                  )}

                </Fragment>
              )
            }]}
          />
        </Modal>
      }
    </>
  )
}


export default component(connect())(SelectPaperVersion)
