import React from 'react'
import PropTypes from 'prop-types';
import { FM } from 'locales';
import { classnames } from 'utils';
import styles from './ConfSider.less';


const ConfSider = props => {
    const { list, onChangeSide, selected } = props;

    const selectKey = key => {
        if (onChangeSide) {
            onChangeSide(key)
        }
    }

    return (
        <ul className={styles.confSider}>
            {list && list.length > 0 && list.map(item => {
                const { title, key } = item
                return (
                    <li
                        key={key} onClick={() => { selectKey(key) }}
                        className={classnames(
                            'sider_item',
                            { selected: selected == key }
                        )}>
                        <span>{title}</span>

                        {/* <FM defaultMessage={title} id={`aminer.home.rankings.conference.menu${key}`} /> */}
                    </li>
                )
            })}
        </ul>
    )
}

ConfSider.propTypes = {
    list: PropTypes.array.isRequired,
    onChangeSide: PropTypes.func,
}

export default React.memo(ConfSider);
