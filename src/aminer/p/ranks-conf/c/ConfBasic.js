import React, { useEffect, useState } from 'react';
import { component, Link } from 'acore';
import { FM } from 'locales';
import styles from './ConfBasic.less';

const ConfBasic = props => {
    const { confIntro, dispatch, id } = props;
    const { conference_name, introduction, wiki_url } = confIntro || {};
    return (
        <div className={styles.confBasic}>
            <h1 className={styles.title}>{conference_name}</h1>
            <div className={styles.searchBlock}>
                <hr className={styles.shr} />
                <Link to={'/ranks/conf'} className={styles.goBack}>
                    <span className={styles.link}>
                        <FM id="aminer.home.rankings.conference.goback" defaultMessage="All conferences" />
                    </span>
                </Link>
                <Link to='/bestpaper'>
                    <FM id="aminer.home.rankings.best" defaultMessage="Best Papers vs Top Cited Papers" />
                </Link>
            </div>
            <div className={styles.desc}>
                <p className={styles.desctext}>
                    {introduction}
                </p>
                <div className={styles.more}>
                    <a target='_blank' href={wiki_url}>more</a>
                </div>
            </div>
        </div>
    )
}

export default component()(ConfBasic)