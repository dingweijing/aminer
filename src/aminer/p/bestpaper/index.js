import React, { useEffect, useState } from 'react';
import { page, connect, Link } from 'acore';
import { Layout } from 'aminer/layouts';
import { BasicTable } from 'amg/ui/table';
import { logtime } from 'utils/log';
import { sysconfig } from 'systems';
import { FM } from 'locales';
import styles from './index.less';

const BestPaperIndex = props => {
    const { dispatch, items, loading } = props;

    useEffect(() => {
        if (!items) {
            dispatch({
                type: 'rank/getBestPaperRankInfo',
                payload: {}
            });
        }
    }, []);

    return (
        <Layout showSearch={true} pageKeywords={`${sysconfig.PageKeywords},最佳论文、高引论文、计算机学科、计算机、计算机会议排名`}>
            <article className={styles.bestPaperHome}>
                <h2>
                    <FM
                        id='aminer.bestpaper.title'
                        defaultMessage='Best Papers vs. Top Cited Papers in Computer Science (since 1996)'
                    />
                    <div className='right'>
                        <Link to="/ranks/conf" className={styles.toconfrank}>
                            <FM id="aminer.home.rankings.conference_rank" defaultMessage="Conference Rank"></FM>
                        </Link>
                        <Link to="/resources/awards-se.html" className='desktop_device tobestpaper'>
                            <span>自然科学类奖项</span>
                        </Link>
                    </div>

                </h2>

                <p className={styles.text}>
                    <FM
                        id='aminer.bestpaper.textdesc'
                        defaultMessage="Evaluation of the quality of a paper, in addition to the number of citations as a reference, the best paper of the conference is also an important evaluation criterion.Are the citations of these best papers high? Do the Top Cited Papers have greater influence? This is a question worth discussing, because it can reflect the generality of academic evaluation.By using MAP (Mean Average Precision), a measure to evaluate the ranking performance, we calculated the MAP score of the conference in a year, which objectively reflected the relationship between the top cited papers and the best papers."
                    />
                </p>
                <BasicTable
                    rowKey='id'
                    className={styles.paperTable}
                    data={items || []}
                    columns={columns}
                />
            </article>
        </Layout>
    );
}


BestPaperIndex.getInitialProps = async ({ store, isServer }) => {
    if (!isServer) { return; }
    logtime('getInitialProps::BestPaperIndex init')
    await store.dispatch({
        type: 'rank/getBestPaperRankInfo',
        payload: {}
    })
    logtime('getInitialProps::BestPaperIndex Done');
    const { rank } = store.getState();
    return { rank };
};

export default page(connect(({ rank, loading }) => ({
    items: rank.bestPaperRankInfo,
    loading: loading.effects['rank/getBestPaperRankInfo']
})))(BestPaperIndex)

const columns = [
    {
        Header: 'Rank',
        accessor: 'rank',
        align: 'center',
        Cell: ({ row: { index } }) => index + 1,
    },
    {
        Header: 'Conference（Full Name）',
        accessor: 'conference_full_name',
        Cell: ({ cell: { row } }) => {
            const { id, conference_full_name, } = row && row.original || {};
            return <Link className={styles.alink} to={`/bestpaper/${id}`}>{conference_full_name}</Link>
        },
    },
    {
        Header: 'Short Name',
        accessor: 'conference_name'
    },
    {
        Header: 'MAP',
        accessor: 'ave_MAP',
        Cell: ({ cell: { value } }) => {
            return value && value.toFixed(2) || null
        },
    },
    {
        width: 145,
        Header: 'CCF Level',
        accessor: 'conference_type',
        align: 'center',
        filterMultiple: false,
        disableFilters: false,
        // filters: [
        //     { text: 'A', value: 'A', },
        //     { text: 'B', value: 'B' },
        //     { text: 'C', value: 'C' },
        //     { text: 'Other', value: 'other' },
        // ],
    },
]
