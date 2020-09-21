import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import { Button, message } from 'antd';
import { formatMessage } from 'locales';
import { classnames } from 'utils';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';

const ConfirmDel = props => {
  const { aid, dispatch, checkDelPubs, papers, resetList, updateDelPubs } = props;

  const submit = () => {
    dispatch({
      type: 'profile/RemovePubsFromPerson',
      payload: {
        id: aid,
        pids: checkDelPubs,
      },
    }).then(() => {
      message.success(
        formatMessage({
          id: 'aminer.paper.delete.success',
          defaultMessage: 'Delete Papers Success',
        }),
      );
      dispatch({
        type: 'modal/close',
      });
      dispatch({
        type: 'profile/updateDelPubs',
        payload: { list: [] },
      });
      resetList();
    });
  };

  const delThePub = pid => {
    if (updateDelPubs) {
      updateDelPubs({ id: pid });
    }
  };

  const curList = papers.filter(paper => checkDelPubs && checkDelPubs.includes(paper.id));

  return (
    <div>
      <PublicationList
        // resetList={resetList}
        papers={curList}
        highlightAuthorIDs={[aid]}
        end
        className="profilePaperDelList"
        showInfoContent={[]}
        // updateDelPubList={value => {
        //   // dispatch({
        //   //   type: 'profile/updateDelPubs',
        //   //   payload: { list: value },
        //   // });
        //   updateDelPubs({ list: value });
        // }}
        contentRightZone={[
          ({ paper }) => {
            return (
              <div className="del_btn">
                <div>
                  <span onClick={delThePub.bind(null, paper.id)}>
                    <svg className={classnames('icon', 'closeSvg')} aria-hidden="true">
                      <use xlinkHref="#icon-modal_close" />
                    </svg>
                  </span>
                </div>
              </div>
            );
          },
        ]}
      />
      {checkDelPubs && checkDelPubs.length > 0 && (
        <div className="profilePaperDelListCommitBtn">
          <Button onClick={submit}>
            {formatMessage({
              id: 'aminer.paper.del.submit',
              defaultMessage: 'Delete Papers',
            })}
          </Button>
        </div>
      )}
    </div>
  );
};

ConfirmDel.propTypes = {};

ConfirmDel.defaultProps = {};

export default component(
  connect(({ profile }) => ({
    checkDelPubs: profile.checkDelPubs,
  })),
)(ConfirmDel);
