import React, { useEffect, useState, Fragment } from 'react';
import { page, connect, Link, component } from 'acore';
import { Layout } from 'aminer/layouts';
import { sysconfig } from 'systems';
import { enUS } from 'locales';
import { Row, Col, Button, Icon, message, Checkbox, Pagination } from 'antd';
import { Spin } from 'aminer/components/ui';
import PaperList from 'aminer/components/pub/PublicationList.tsx';
import { ExpertLink } from 'aminer/components/widgets';
import { PersonIndices, PersonTags, ViewExpertInfo } from 'components/person/widgets';
import { PersonList } from 'components/person';
import display from 'utils/display';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { parseUrlParam } from 'helper';
import { authorInitialCap } from 'aminer/core/pub/utils';
import styles from './index.less';

const { PubList_Show_Authors_Max = 12 } = sysconfig;

const listMaxSize = 10;

const PaperIndex = props => {
    const [paperInfo, setPaperInfo] = useState();
    const [checkId, setCheckId] = useState();
    const [authorList, setAuthorList] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [total, setTotal] = useState(0);
    const { dispatch, loading } = props;

    useEffect(() => {
        getNaPaperInfo();
    }, []);

    useEffect(() => {
        if (paperInfo && paperInfo.id) {
            getNaResult(paperInfo.id);
        }
    }, [paperInfo, pageNum]);

    const getNaPaperInfo = () => {
        dispatch({ type: 'pub-na/getNaPaperInfo' })
            .then((data) => {
                setPaperInfo(data && data[0]);
            })
    }

    const getNaResult = (pid) => {
        dispatch({
            type: 'pub-na/getNaResult',
            payload: {
                pid, author_order: findEditOrder(),
                offset: (pageNum - 1) * listMaxSize, size: listMaxSize
            }
        }).then((data) => {
            setTotal(data && data.keyValues && data.keyValues.total || 0);
            const ids = data.items && data.items[0] && data.items[0].map((n) => n.ID)
            getAuthorList(ids);
        })
    }

    const getAuthorList = (ids) => {
        if (ids && ids.length) {
            dispatch({
                type: 'pub-na/getAuthorList',
                payload: { ids, size: listMaxSize }
            }).then(data => {
                if (data) {
                    const map = {};
                    data.map(n => map[n.id] = n);
                    setAuthorList(ids.map(n => map[n]));
                } else { setAuthorList([]); }
            })
        }
        else {
            setAuthorList([]);
        }
    }

    const createPaperAuthor = (index) => {
        dispatch({
            type: 'pub-na/CreatePaperAuthor',
            payload: {
                pid: paperInfo && paperInfo.id,
                author_order: index,
            }
        }).then((data) => {
            data && getNaPaperInfo();
        })
    }

    const rightZoneFuncs =
        [
            ({ person: { id } }) => {
                return (
                    <Checkbox key="1"
                        checked={checkId === id}
                        onChange={() => setCheckId(id)}
                    />
                )
            },
        ]

    const findEditOrder = () => {
        const { authors } = paperInfo || {};
        return authors ? authors.findIndex((n) => !n.id) : -2;
    };

    const submit = () => {
        if (checkId && paperInfo && paperInfo.id) {
            dispatch({
                type: 'profile/AddPubsToPerson', // 这里的R(index可能有问题)
                payload: {
                    id: checkId, pubs: [{ i: paperInfo.id, r: findEditOrder() }]
                }
            }).then((res) => {
                if (res) {
                    getNaPaperInfo();
                    message.success('success');
                }
            })
        } else {
            message.error('Please select a person!')
        }
    }

    // const nextPaper = () => { getNaPaperInfo() }

    const renderAuthorsFun = (paper) => {
        const { authors } = paper;
        return (
            <div className={styles.renderAuthors}>
                {authors && authors.length > 0 && authors.slice(0, PubList_Show_Authors_Max).map((author, index) => {
                    let { name, name_zh, id, org } = author;
                    const locale = sysconfig.Locale;
                    const isDefaultLocale = locale === enUS;
                    if (!isDefaultLocale) { [name, name_zh] = [name_zh, name] }
                    name = authorInitialCap(name || name_zh);
                    const params = {
                        className: classnames('author', {
                            'editLink': findEditOrder() === index
                        })
                    }
                    return (
                        <Fragment key={id || name}>
                            {id && (
                                <ExpertLink author={author}>
                                    <Link className='hasIdLink' to={getProfileUrl(author.name, author.id)}>
                                        {name || name_zh || ''}
                                    </Link>
                                </ExpertLink>
                            )
                            }
                            {!id && (
                                <span {...params}>
                                    <span className="nameorg">
                                        <span className="noIdlink">{name || name_zh || ''}</span>
                                        {org && (
                                            <>
                                                <br /><i className="fa fa-institution fa-fw aff"></i>
                                                <span className='aff'>{org}</span>
                                            </>
                                        )}
                                    </span>
                                    <svg onClick={createPaperAuthor.bind(this, index)} className="icon addIcon" aria-hidden="true">
                                        <use xlinkHref="#icon-add"></use>
                                    </svg>
                                </span>
                            )}
                            {(index + 1) !== authors.length && (<span className="split" />)}
                        </Fragment>
                    )
                })
                }
            </div >
        )
    };

    const onChangePage = (n) => { setPageNum(n) };

    return (
        <Layout showSearch={true}>
            <article className={styles.paperIndex}>
                <h2 className={styles.demoHeader}>Paper Na</h2>
                <PaperList
                    id='aminerPaperList'
                    papers={paperInfo ? [paperInfo] : []}
                    contentLeftZone={[]}
                    contentRightZone={[]}
                    authorsZone={[({ paper }) => {
                        return renderAuthorsFun(paper)
                    }]}
                    // renderAuthorsFun={}
                />
                <Spin loading={!!loading} />
                <Row gutter={12}>
                    <Col span={12}>
                        <PersonList
                            id="aminerPersonList"
                            rightZoneFuncs={rightZoneFuncs}
                            persons={authorList && authorList.slice(0, listMaxSize / 2)}
                        />
                    </Col>
                    <Col span={12}>
                        <PersonList
                            emptyPlaceHolder=''
                            rightZoneFuncs={rightZoneFuncs}
                            persons={authorList && authorList.slice(listMaxSize / 2, listMaxSize)}
                        />
                    </Col>
                </Row>
                <div className={styles.footer}>
                    <Pagination
                        current={pageNum}
                        total={total} pageSize={10}
                        onChange={onChangePage}
                        className={styles.pagination}
                    />
                    <Button onClick={submit} type='primary' className={styles.subBtn}>Submit</Button>
                    {/* <Button onClick={nextPaper} disabled={findEditOrder() !== -1} type='primary'>Next Paper</Button> */}
                </div>
            </article>
        </Layout >
    );
}


export default page(connect(({ loading }) => ({
    loading: loading.effects['pub-na/getNaResult']
})))(PaperIndex)
