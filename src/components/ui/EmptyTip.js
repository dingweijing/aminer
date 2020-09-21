import { component } from 'acore';
import { FM } from 'locales';
import { classnames } from 'utils';
import styles from './EmptyTip.less';

const EmptyTip = props => {
  const { text, fatherStyle } = props;

  return (
    <div className={classnames(styles.emptyTip, fatherStyle)}>
      {text || <FM id='aminer.conf.nodata' />}
    </div>
  )
}

export default component()(EmptyTip)
