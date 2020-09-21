// 城市排名
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { page, connect } from 'acore';
import { Layout, EmptyLayout } from 'aminer/layouts';
import { getDomCenterPoint } from 'utils/utils';
import { classnames } from 'utils/';
import { Tabs, Input, Icon } from 'antd';
import ThreeDEarth from './components/3DEarth';
import styles from './cityrank.less';
import Header from './components/Header';
import CityCard from './components/CityCard';
import CityFeedBack from './components/CityFeedBack';
import RankTab from './components/RankTab';
import CityAuthor from './components/CityAuthor';
import { RankItem } from './components/RankList';
import EarthFackModal from './components/EarthFackModal';

const { TabPane } = Tabs;
const { Search } = Input;



interface IPropTypes {}


const CityRank: React.FC<IPropTypes> = props => {
  const { dispatch, list, onToggle, starListMap,authorList } = props;
  const [geo, setPos] = useState([0, 0]);
  const [active, setActive] = useState({});
  const [detailState, setDetailState] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [activeTabId,setTabActiveId]=useState(0)
  const [searchInput,setSearchInput]=useState('')
  // const [centerPoint, setCenterP] = useState({ top: 0, left: 0 });

  const listRef=useRef()
  const starListLength=Object.keys(starListMap).length

  const rankTabs=useMemo(()=>[
  {Top:'榜单',Bottom:<span style={{ color: 'yellow' }}>{list.length}</span>},
    {Top:'试试手气',Bottom:<span style={{ color: 'yellow' }}>59</span>},
  {Top:'我的城市',Bottom:<span style={{ color: 'yellow' }}>{starListLength}</span>},
  ],[list.length,starListLength])

  const starList = useMemo(() => {
    return Object.entries(starListMap).map(([k, v]) => v);
  }, [starListLength]);

  const getAuthorId=id=>{
    dispatch({ type: 'cityrank/getAuthorList',payload:{id} });
  }

  const randomSelect=()=>{
    const len=list.length
    const randomObj=list[(Math.random()*len).toFixed(0)]
    setActive(randomObj)
    calculateTop(randomObj)
    const {geo}=randomObj
    const {lat,lng}=geo
    setPos([lng,lat])
    getAuthorId(randomObj.id)
  }

  const renderList = tabIndex === 1 ? starList : list;
  const onRankItemClick = d => {
    const {lat,lng}=d.geo
    setPos([lng,lat]);
    setActive(d);
    getAuthorId(d.id)

 /*    setTimeout(() => {
      setDetailState(true);
    }, 1500); */
  };
  // 给城市投票
  const onCityPoll=(id,poll,idx)=>{
    dispatch({type:'cityrank/pollCity',payload:{id,poll,idx}})
  }
 
  const onSearch=text=>{
    dispatch({type:'cityrank/search',payload:{text}})
  }
  const onTabClick=(idx)=>{
    setTabActiveId(idx)
    switch(idx){
      case 0:setTabIndex(0);break;
      case 1:randomSelect()
      break;
      case 2:setTabIndex(1)
      break;
      default: break;
    }
  }
  // 滚动高度
  const calculateTop=(selectedItem)=>{
    const idx=list.findIndex(item=>selectedItem.id===item.id)
    const top=idx*100
    listRef.current.scrollTop=top
  }
  // 计算地球中心
  const calculateEarthCenter = () => {
    // 显示窗口的宽度和高度
    const { clientWidth, clientHeight } = document.querySelector('.back');
    // 宽度乘以0.7,拿到坐标
    const center = { left: clientWidth * 0.7, top: clientHeight * 0.5 + 73 };
    // setCenterP(center);
  };

  const handleMyCity = (value: any) => {
    // 处理“我的城市”
    dispatch({ type: 'cityrank/toggleStarList', payload: { id: value.id, value } });
  };

  useEffect( () => {
      dispatch({ type: 'cityrank/getRankList' });
/*     if (list && list[0]) {
      setActive(list[0]);
      dispatch({ type: 'cityrank/getAuthorList',payload:{id:list[0].id} });
    } */
/*     setTimeout(() => {
      calculateEarthCenter();
    }, 1000); */
  }, []);

  useEffect(()=>{
    if (!active.id&&list && list[0]) {
      setActive(list[0]);
      dispatch({ type: 'cityrank/getAuthorList',payload:{id:list[0].id} });
    }
  },[list.length])

  const EchartsMap = useMemo(() => <ThreeDEarth nowPos={[geo]} />, [geo[0], geo[1]]);

  return (
    <EmptyLayout pageTitle="AI OPEN INDEX" pageSubTitle="AI 2000" {...props}>
      <div className={styles.container}>
        <Header type="cityrank" className={styles.myHeader} isIndex={false} />
        <div className="back">
          {/* 下层地球 */}
          {EchartsMap}
        </div>

        <div className="rank">
          <div className="search-box">
            <Search type="text" placeholder="请输入城市或国家" onChange={e=>setSearchInput(e.target.value)} onSearch={onSearch} value={searchInput}/>
          </div>

          <div className="ranklist" ref={listRef}>
            {renderList.map((d, idx) => (
              <RankItem
                active={active && active.id === d.id}
                {...d}
                order={idx + 1}
                key={d.id}
                onClick={() => onRankItemClick({ ...d, rank: idx + 1 })}
              />
            ))}
          </div>
        </div>

        <div className="rank-tab">
          {rankTabs.map((rank,idx)=>( <RankTab onClick={onTabClick.bind(null,idx)}
           active={activeTabId===idx} key={idx} Top={rank.Top} Bottom={rank.Bottom} />))}
        </div>
        <CityCard detail={active} isStar={starListMap[active.id]} onToggle={handleMyCity} />
        <CityFeedBack detail={active}  onClick={onCityPoll}/>
        
        <div className="authorList">
          <div className="inner">
            {authorList.map(author=>(<CityAuthor key={author.id} {...author}/> ))}
          </div>
        </div>
      </div>
    </EmptyLayout>
  );
};

export default page(
  connect(({ auth, aminerTopic, loading, cityrank }) => ({
    starListMap: cityrank.starListMap,
    list: cityrank.list,
    authorList:cityrank.authorList
    /*     user: auth.user,,
        roles: auth.roles,
        total: aminerTopic.total,
        topicInfo: aminerTopic.topicInfo,
        paperList: aminerTopic.paperList,
        keywordsList: aminerTopic.keywordsList,
        authorList: aminerTopic.authorList,
        loading: loading.effects['aminerTopic/getTopicById'], */
  })),
)(CityRank);
