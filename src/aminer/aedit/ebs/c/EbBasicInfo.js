/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sysconfig } from 'systems';
import H from 'helper';
import { zhCN } from 'locales';
import { ListTristate } from 'components/core';
import styles from './EBBasicInfo.less';

export default class EbBasicInfo extends Component {
    static propTypes = {
        eb: PropTypes.object,
    };

    static defaultProps = {};

    render() {
        const { eb } = this.props;
        const { name, name_zh, desc, desc_zh, created_time, updated_time } = eb || {};
        const { mainName, subName, isDefaultLocale } = H.renderLocalNames(name, name_zh);

        const i18ndesc = sysconfig.Locale === zhCN
            ? desc_zh || desc
            : desc || desc_zh;

        const time = created_time || updated_time;
        return (
            <div className={styles.ebBasicInfo}>
                <ListTristate condition={eb}>
                    <div className={styles.titleLine}>
                        <h1 className={styles.title}>
                            {mainName}
                            {subName && (
                                <span className={styles.subTitle}>
                                    {isDefaultLocale ? `（${subName}）` : `(${subName})`}
                                </span>
                            )}
                        </h1>
                        <div className={styles.infoBlock}>
                            <div>创建时间：
                             {time && time.split("T") && time.split("T")[0]}
                            </div>
                        </div>
                    </div>

                    {i18ndesc && <div className={styles.desc}>{i18ndesc}</div>}

                </ListTristate>
            </div>
        );
    }
}
