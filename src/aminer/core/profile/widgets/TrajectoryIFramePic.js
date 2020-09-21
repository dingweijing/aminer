import React, { useEffect, useState, useMemo, memo } from 'react';
import { connect, component } from 'acore';
import classnames from 'classnames';
import { FM, formatMessage } from 'locales';
import consts from 'consts';

// trajectory
const trajectoryPath = `${consts.ResourcePath}/sys/aminer/icon/show-trajectory.png`;

const Trajectorie = memo(props => {
  const { personId } = props;
  return (
    <iframe
      title="traj2"
      src={`https://traj2.aminer.cn/external-singleTrajectory?id=${personId}&flag=aminer`}
      className="showbox" height="100%" width="100%"
      ng-src="url" allowFullScreen="allowfullscreen"
      webkitallowfullscreen="webkitallowfullscreen"
    />
  )
});

const TrajectoryIFramePic = props => {
  const { dispatch, personId, className } = props;

  const showIframe = () => {
    if (!personId) {
      return
    }
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.person.trajectories', defaultMessage: "Scholars' Trajectories and Heat Map" }),
        height: '90vh',
        width: '90vw',
        content: <Trajectorie personId={personId} />
      }
    });
  };

  return (
    <div className={className} onClick={showIframe}>
      <img src={trajectoryPath} alt="" />
      <span className="showTraj">
        <FM id="aminer.person.label.showTraj" defaultMessage="Show Trajectory" />
      </span>
    </div>
  )
}

export default component(connect())(TrajectoryIFramePic)
