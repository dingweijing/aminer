import React, { useState } from 'react';
import { Layout } from 'aminer/layouts';
import { connect } from 'acore';
import VideoList from './components/videoList';
import VideoPlayer from 'aminer/components/video/fullPagePlayer';

const VideoPage = (props) => {
  const videoList = [
    {
      cover: 'https://static.aminer.cn/buildin/confs/984/316/511/5ed7103c92c7f9be217bde2c_4.png',
      title: '测试',
      desc: '只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述',
      url: 'https://originalstatic.aminer.cn/misc/confvideo/iclr/iclr.m3u8',
      viewNum: 10,
      id: 'dddxdfsdfsd1'
    },
    {
      cover: 'https://static.aminer.cn/buildin/confs/984/316/511/5ed7103c92c7f9be217bde2c_4.png',
      title: '测试',
      desc: '只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述',
      url: 'https://originalstatic.aminer.cn/misc/confvideo/iclr/iclr.m3u8',
      viewNum: 10,
      id: 'dddxdfsdfsd2'
    },
    {
      cover: 'https://static.aminer.cn/buildin/confs/984/316/511/5ed7103c92c7f9be217bde2c_4.png',
      title: '测试',
      desc: '只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述',
      url: 'https://originalstatic.aminer.cn/misc/confvideo/iclr/iclr.m3u8',
      viewNum: 10,
      id: 'dddxdfsdfsd3'
    }, {
      cover: 'https://static.aminer.cn/buildin/confs/984/316/511/5ed7103c92c7f9be217bde2c_4.png',
      title: '测试',
      desc: '只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述',
      url: 'https://originalstatic.aminer.cn/misc/confvideo/iclr/iclr.m3u8',
      viewNum: 10,
      id: 'dddxdfsdfsd4'
    },
    {
      cover: 'https://static.aminer.cn/buildin/confs/984/316/511/5ed7103c92c7f9be217bde2c_4.png',
      title: '测试',
      desc: '只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述',
      url: 'https://originalstatic.aminer.cn/misc/confvideo/iclr/iclr.m3u8',
      viewNum: 10,
      id: 'dddxdfsdfsd33'
    },
    {
      cover: 'https://static.aminer.cn/buildin/confs/984/316/511/5ed7103c92c7f9be217bde2c_4.png',
      title: '测试',
      desc: '只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述只是一段描述',
      url: 'https://originalstatic.aminer.cn/misc/confvideo/iclr/iclr.m3u8',
      viewNum: 10,
      id: 'dddxdfsdfsd22'
    }
  ]

  const { dispatch } = props;
  const videoConfig = {}

  const clickVideo = (id, url) => {
    /**
     *  在这里可以进行操作，记录点击量等行为，callback会把id和url带回来
     */
    dispatch({
      type: 'modal/open',
      payload: {
        showHeader: false,
        maskClosable: true,
        height: '562px',
        width: '1000px',
        content: <VideoPlayer video={{ url }} {...videoConfig} />,
        handelOk: () => {
          console.log('handelOk');
        },
      },
    });
  }

  return (

    <Layout
      showHeader={true}
      showFooter={false}
    >
      <VideoList list={videoList} clickVideoCallBack={clickVideo} />
    </Layout>
  )
}

export default connect()(VideoPage);
