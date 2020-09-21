import React, { } from 'react';
import { component, connect } from 'acore';
import { Panel } from 'aminer/ui/panel';
import { formatMessage, FM } from 'locales';
import styles from './PanelBestPaper.less';

// TODO load data it self.
const PanelBestPaper = props => {
  const { withPanel, bestpapers } = props;
  
  if (!bestpapers || bestpapers.length === 0) {
    return false;
  }

  const content = () => bestpapers && (
    <div className={styles.content}>
      {bestpapers && bestpapers.length > 0 && bestpapers.map(paper => (
        <FM key={paper.paper_id}
          id="aminer.paper.bestpaper.describe"
          defaultMessage="Best Paper"
          values={{ year: paper.year, conf: paper.jconf }}
        />
      ))}
    </div>
  )

  if (withPanel) {
    return (
      <Panel
        title={formatMessage({ id: 'aminer.paper.bestpaper', defaultMessage: 'Best Paper' })}
        className={styles.bestpapers}
        subContent={content}
      />
    )
  }
  // const hide = false;
  // return content({ subStyle: hide ? 'tiny' : 'normal', onUnfold: () => { } });
  return content();
}

export default component()(PanelBestPaper);
