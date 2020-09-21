import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore'
import { Icon } from 'antd'
import { getLangLabel } from 'helper';
import Message from './Message'
import Question from './Question'
import styles from './Robot.less'

const robot_zh = '小脉'
const robot_cn = 'Xiao Mai'
const title_zh = '科研助手'
const title_cn = 'Research Assistant'
const robot_first_msg_zh = '你好, 我是你的科研助手小脉,您可以在下方问题选择框中选择您感兴趣的问题问我,欢迎您的提问'
const robot_first_msg_cn = 'Hello, I am your research assistant Xiao Mai, you can choose the question you are interested in in the question selection box below to ask me, and welcome your questions'

const Robot = props => {
  const { displayRobot, dispatch, openQ3Modal } = props
  const [confList, setConfList] = useState(null);
  const domainZH_CNMap = new Map();
  domainZH_CNMap.set('人工智能', 'Artificial Intelligence')
  domainZH_CNMap.set('交叉/综合/新兴', 'Cross/Comprehensive/Emerging')
  domainZH_CNMap.set('计算机图形学与多媒体', 'Computer Graphics and Multimedia')
  domainZH_CNMap.set('计算机网络', 'Computer Network')
  domainZH_CNMap.set('数据库/数据挖掘/内容检索', 'Database/Data Mining/Content Retrieval')
  domainZH_CNMap.set('网络与信息安全', 'Network and Information Security')
  domainZH_CNMap.set('人机交互与普适计算', 'Human-computer interaction and ubiquitous computing')
  domainZH_CNMap.set('计算机体系结构/并行与分布计算/存储系统', 'Computer Architecture/Parallel and Distributed Computing/Storage System')
  domainZH_CNMap.set('计算机科学理论', 'Computer Science Theory')
  domainZH_CNMap.set('软件工程/系统软件/程序设计语言', 'Software Engineering/System Software/Program Design Language')
  // 生成id
  const generate_id = len => Number(Math.random().toString().substr(3, len) + Date.now()).toString(36)
  let [msgQueue, setMsgQueue] = useState([
    {
      id: generate_id(8),
      content: robot_first_msg_zh,
      content_cn: robot_first_msg_cn,
      link: '',
      role: 'robot',
      source: robot_zh,
      source_cn: robot_cn,
    }
  ])
  // 返回错误信息
  const err_msg = () => {
    const msg = {
      id: generate_id(8),
      content: '抱歉，您的问题小脉暂时无法回答',
      content_cn: 'Sorry, Xiao Mai cannot answer your question temporarily',
      role: 'robot'
    }
    return msg
  }
  // 问题Q3 汉字转英文
  const Q3_replace = msg => {
    if (msg && msg !== '') {
      const reg = /[\u4e00-\u9fa5]/g;
      if (msg.match(reg)) {
        const ZH_str = msg.match(reg).join('');
        return msg.replace(ZH_str, `${domainZH_CNMap.get(ZH_str)}: `)
      }
      return msg
    }
    return '';
  }
  // console.log('convert ', Q3_replace('the H5-index of this category is: 37.52'))
  // 构建user message
  const user_msg = (title, conf, time, domain) => {
    let msg = {}
    switch (title) {
      case 'Q1':
        msg = {
          id: generate_id(8),
          content: `查询会议 ${conf[0].conference_name} ${time[0]}年-${time[1]} 年最牛的论文有哪些`,
          content_cn: `What are the best papers in ${conf[0].conference_name} from ${time[0]} to ${time[1]}`,
          role: 'user'
        }
        break;
      case 'Q2':
        msg = {
          id: generate_id(8),
          content: `查询会议 ${conf[0].conference_name} 华人数量和占比情况`,
          content_cn: `What's the number and proportion of Chinese in ${conf[0].conference_name}`,
          role: 'user',
        }
        break;
      case 'Q3':
        msg = {
          id: generate_id(8),
          content: `查看${domain} 领域平均H5值`,
          content_cn: `View the average H5 value in the field of ${domainZH_CNMap.get(domain)}`,
          role: 'user'
        }
        break;
      case 'Q4':
        msg = {
          id: generate_id(8),
          content: `查看${conf[0].conference_name} 会议的最优指标`,
          content_cn: `View the best indicators of ${conf[0].conference_name}`,
          role: 'user'
        }
        break;
      case 'Q5':
        msg = {
          id: generate_id(8),
          content: `查询会议 ${conf[0].conference_name} 热点话题`,
          content_cn: `View the hot topics of ${conf[0].conference_name}`,
          role: 'user'
        }
        break;
      case 'Q3-2':
        msg = {
          id: generate_id(8),
          content: '会议的排名数据会受到其所在领域的影响吗',
          content_cn: 'Will the ranking data of the conference be affected by its field?',
          role: 'user'
        }
        break;
      default:
        msg = {}
    }
    return msg;
  }
  // 构建robot message
  const robot_msg = (title, res) => {
    let msg = {}
    switch (title) {
      case 'Q1':
        msg = {
          id: generate_id(8),
          content: `为您发现一篇论文 ${res.title} 发表于${res.year}年, 引用数为: ${res.citation}`,
          content_cn: `Here's a paper I found for you, ${res.title} published in ${res.year}, citations: ${res.citation}`,
          link: `https://www.aminer.cn/pub/${res.paper_id}`,
          role: 'robot',
          source: 'AMiner',
        }
        break;
      case 'Q2':
      case 'Q4': case 'Q5':
        msg = {
          id: generate_id(8),
          content: res.CN,
          content_cn: res.EN,
          role: 'robot',
          source: 'AMiner',
        }
        break;
      case 'Q3':
        msg = {
          id: generate_id(8),
          content: res.CN,
          content_cn: Q3_replace(res.EN),
          role: 'robot',
          source: 'AMiner',
        }
        break;
      default:
        msg = {}
    }
    return msg
  }
  const getConfList = () => {
    dispatch({
      type: 'rank/getConfListRobot',
      payload: {
        category_type: 'ccf',
        category: null
      }
    }).then(res => {
      setConfList(res)
      const obj = { data: res }
      window.sessionStorage.setItem('confList', JSON.stringify(obj))
    })
  }
  const ifConfDataExists = () => {
    if (!confList || !confList.length) {
      const data = window.sessionStorage.getItem('confList')
      if (!data) {
        getConfList()
      } else {
        const list = JSON.parse(data).data
        setConfList(list)
      }
    }
  }
  // 问题1 处理函数
  const handleQ1Change = (title, conf, time) => {
    msgQueue = msgQueue.concat(user_msg(title, conf, time, null))
    setMsgQueue(msgQueue)
    dispatch({
      type: 'rank/getQ1Answer',
      payload: {
        question: title,
        id: conf[0].id,
        year_begin: Number(time[0]),
        year_end: Number(time[1])
      }
    }).then(res => {
      if (res) {
        msgQueue = msgQueue.concat(robot_msg(title, res))
      } else {
        msgQueue = msgQueue.concat(err_msg())
      }
      setMsgQueue(msgQueue)
    })
  }
  // 问题3 处理函数
  const handleQ3Change = (title, domain) => {
    msgQueue = msgQueue.concat(user_msg(title, null, null, domain))
    setMsgQueue(msgQueue)
    dispatch({
      type: 'rank/getQ2_Q5Answer',
      payload: {
        question: title,
        category: domain
      }
    }).then(res => {
      if (res) {
        msgQueue = msgQueue.concat(robot_msg(title, res))
      } else {
        msgQueue = msgQueue.concat(err_msg())
      }
      setMsgQueue(msgQueue)
    })
  }
  // 问题4 处理函数
  // const handleQ4Change = (title, conf) => {
  //   msgQueue = msgQueue.concat(user_msg(title, conf, null, null))
  //   setMsgQueue(msgQueue)
  //   dispatch({
  //     type: 'rank/getQ2_Q5Answer',
  //     payload: {
  //       question: title,
  //       id: conf[0].id
  //     }
  //   }).then(res => {
  //     if (res) {
  //       msgQueue = msgQueue.concat(robot_msg(title, res))
  //     } else {
  //       msgQueue = msgQueue.concat(err_msg())
  //     }
  //     setMsgQueue(msgQueue)
  //   })
  // }
  // 问题2 处理函数
  const handleQ2Change = (title, conf) => {
    msgQueue = msgQueue.concat(user_msg(title, conf, null, null))
    setMsgQueue(msgQueue)
    dispatch({
      type: 'rank/getQ2_Q5Answer',
      payload: {
        question: title,
        id: conf[0].id
      }
    }).then(res => {
      if (res) {
        msgQueue = msgQueue.concat(robot_msg(title, res))
      } else {
        msgQueue = msgQueue.concat(err_msg())
      }
      setMsgQueue(msgQueue)
    })
  }
  // 用户再见
  // const recvUserMsg = msg => {
  //   console.log('msg ', msg)
  // }
  // 根据题号，获取第一层回答
  const sendTitleMsg = title => {
    msgQueue = msgQueue.concat(user_msg('Q3-2', null, null, null))
    setMsgQueue(msgQueue)
    dispatch({
      type: 'rank/getQ2_Q5Answer',
      payload: {
        question: title,
      }
    }).then(res => {
      if (res) {
        msgQueue = msgQueue.concat(robot_msg(title, res))
      } else {
        msgQueue = msgQueue.concat(err_msg())
      }
      setMsgQueue(msgQueue)
    })
  }

  useEffect(() => {
    // getConfList();
    ifConfDataExists()
  }, [ifConfDataExists]);
  return (
    <div className={styles.robot}>
      <div className="head-line">
        <span>{getLangLabel(title_cn, title_zh)}</span>
        <span onClick={displayRobot}><Icon type="close" style={{ fontSize: '12px' }} /></span>
      </div>
      <div className="content">
        {msgQueue && msgQueue.map(item => (
          item.role === 'robot' ? <div key={item.id} className="role-robot">
            <Message
              {...item}
            /></div> : <div key={item.id} className="role-user">
              <Message
                {...item}
              />
            </div>
        ))}
      </div>
      {/* <div className="bye" onClick={() => recvUserMsg('再见')}>
        <p>再见</p>
      </div> */}
      <div className="bottom">
        {confList ? <Question
          handleQ1Change={handleQ1Change}
          handleQ2Q4Q5Change={handleQ2Change}
          handleQ3Change={handleQ3Change}
          openQ3Modal={openQ3Modal}
          // handleQ4Change = {handleQ4Change}
          sendTitleMsg={sendTitleMsg}
          confList={confList}
          domainZH_CNMap={domainZH_CNMap}
        /> : null}
      </div>
    </div>
  );
}

// export default Robot;
export default component(connect(({ rank }) => ({ rank })))(Robot);
