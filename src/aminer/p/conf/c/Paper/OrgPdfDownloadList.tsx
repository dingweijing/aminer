import React, { useEffect, useState } from 'react';
import { page, connect, Link } from 'acore';
import { Divider } from 'antd';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { SetOrGetViews } from '../SetOrGetViews';
import styles from './OrgPdfDownloadList.less';

interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  SetOrGetViews: (type: string, dispatch: any, id: any) => void;
  confInfo: any;
  orgData: any;
  org: any;
}

const OrgPdfDownloadList: React.FC<Proptypes> = props => {
  const [download_org, setDownloadOrg] = useState();
  const { dispatch, confInfo, orgData } = props;

  let download_org_temp;
  useEffect(() => {
    if (confInfo && confInfo.config) {
      const { config } = confInfo;
      const { paper = {} } = config;
      if (paper && paper.org) {
        dispatch({
          type: 'aminerConf/getInterpretation',
          payload: { id: confInfo && confInfo.id, type: 'org' },
        });
      }
      download_org_temp = paper?.download_org?.length > 0 ? paper.download_org : [];
    } else {
      download_org_temp = [];
    }
    setDownloadOrg(download_org_temp);
  }, []);

  return (
    <div className={classnames(styles.orgPdfDownloadList)}>
      {/* {download_org && download_org.length > 0 && (
        <div className="downloadAllPdf desktop_device">
          {download_org.map((item: any, index: number) => {
            return (
              <>
                <Link
                  className="downloadpdfs"
                  key={item.key}
                  to={`/conf/${confInfo.short_name}/download/${item.key}`}
                  onClick={
                    SetOrGetViews &&
                    SetOrGetViews.bind(null, 'click', dispatch, confInfo && confInfo.id)
                  }
                >
                  {item.val}
                </Link>
                {index !== download_org.length - 1 && (
                  <Divider type="vertical" key={`${item.key}_divider`} />
                )}
              </>
            );
          })}
        </div>
      )} */}
      {orgData && (
        <div className="downloadAllPdf desktop_device">
          {Object.entries(orgData).map(([org_key, org], index) => (
            <>
              <Link
                className="downl∂oadpdfs"
                key={org.name}
                to={`/conf/${confInfo.short_name}/org/${org_key}`}
                onClick={
                  SetOrGetViews &&
                  SetOrGetViews.bind(null, 'click', dispatch, confInfo && confInfo.id)
                }
              >
                {getLangLabel(org.name, org.name_zh)}
              </Link>
              {index !== Object.values(orgData).length - 1 && (
                <Divider type="vertical" key={`${org.name}_divider`} />
              )}
            </>
          ))}
          {download_org?.length > 0 &&
            download_org.map((item: any, index: number) => {
              return (
                <>
                  {orgData && Object.entries(orgData).length > 0 && (
                    <Divider type="vertical" key={`${item.key}_divider`} />
                  )}
                  <Link
                    className="downloadpdfs"
                    key={item.key}
                    to={`/conf/${confInfo.short_name}/download/${item.key}`}
                    onClick={
                      SetOrGetViews &&
                      SetOrGetViews.bind(null, 'click', dispatch, confInfo && confInfo.id)
                    }
                  >
                    {item.val}
                  </Link>
                  {index !== download_org.length - 1 && (
                    <Divider type="vertical" key={`${item.key}_divider`} />
                  )}
                </>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default page(
  connect(({ aminerConf }) => ({
    orgData: aminerConf.orgData,
  })),
)(OrgPdfDownloadList);
