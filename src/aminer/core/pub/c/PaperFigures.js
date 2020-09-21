import React, { useEffect, useState } from 'react';
import { component, useCallback, connect } from 'acore';
import { FM } from 'locales';
import { Tooltip, Popconfirm, message } from 'antd';
import pubHelper from 'helper/pub';
import { classnames } from 'utils';
import { isAuthed, isRoster } from 'utils/auth';
import styles from './PaperFigures.less';

const showMaxSize = 5;

const PaperFigures = props => {
  const { pid, data, dispatch, roles, user } = props;
  const { figure_urls, figure_captions } = data || {};
  const [newImg, setNewImg] = useState([])
  const [errImg, setErrImg] = useState(false)
  const [more, setMore] = useState(false);

  useEffect(() => {
    if (figure_urls && figure_urls.length) { init() }
  }, [figure_urls, roles])

  useEffect(() => {
    if (errImg) {
      dispatch({
        type: 'pub/setMarkErrorPicture', payload: {
          "id": [pid],
        }
      })
    }
  }, [errImg])

  const init = () => {
    figure_urls.forEach((item, index) => {
      const title = figure_captions && figure_captions[index] && figure_captions[index].caption || ''
      createImgUrl(item, index, title);
    })
  }

  if (!figure_urls || !figure_urls.length || !pid) {
    return null;
  }

  const createImgUrl = (url, index, title) => {
    const new_url = pubHelper.getPubImg({ id: pid, img: url })
    const ImgObj = new Image();
    ImgObj.src = new_url;
    ImgObj.onload = () => {
      newImg[index] = {
        url: new_url,
        title,
      }
      setNewImg([...newImg])
    }
    ImgObj.onerror = () => {
      if (isAuthed(roles) || isRoster(user)) {
        newImg[index] = {
          url: new_url,
          title,
        }
      } else {
        newImg[index] = {
          url: '',
          title: '',
        }
      }
      if (!errImg) { setErrImg(true) }
      setNewImg([...newImg])
    }
  }

  const onImgClick = (src, intro) => {
    dispatch({
      type: 'imgViewer/open',
      payload: { src, intro }
    })
  }

  const deleteImg = (url, index) => {
    dispatch({
      type: 'pub/RemoveWrongImage',
      payload: { id: pid, urls: [url] }
    }).then(res => {
      if (res) {
        message.success('delete success')
        newImg.splice(index, 1)
        setNewImg([...newImg])
      }
    })
  }

  const seeMore = () => setMore(!more);

  const renderImg = (imgUrl, startIndex) => (
    imgUrl.map(({ url, title }, index) => {
      return (
        <div key={`${url}${index}`} className={styles.item}>
          <div className={styles.label}>{index + 1 + startIndex}</div>
          <img onClick={() => onImgClick(url, title)} src={url} className={styles.img} />
          <div className={styles.imgWord}>
            {title && title.length > 50 ?
              (
                <>
                  {title && title.substring(0, 49)}
                  <Tooltip placement="top" title={title}><span>...</span></Tooltip>
                </>
              ) : title
            }
          </div>
          {
            (isAuthed(roles) || isRoster(user)) && (
              <Popconfirm title="确定删除图片？" okText="是" cancelText="否" onConfirm={() => deleteImg(url, index + startIndex)}>
                <svg className={classnames('icon', 'deleteImg')} aria-hidden="true">
                  <use xlinkHref='#icon-modal_close' />
                </svg>
              </Popconfirm>
            )
          }
        </div>
      )
    })
  )

  const filterImg = newImg && newImg.length && newImg.filter(item => (item && item.url))

  return (
    filterImg && filterImg.length > 0 && (
      <div className={styles.paperFigures}>
        <div className={styles.headtitle}>
          <span className={styles.labelText}>
            <FM id="aminer.paper.figures" defaultMessage="Figures" />
          </span>
          <FM id='aminer.common.colon' defaultMessage=': ' />
        </div>
        <div className={styles.figures}>
          {renderImg(filterImg.slice(0, showMaxSize), 0)}
          {filterImg.length > showMaxSize && more && renderImg(filterImg.slice(showMaxSize), showMaxSize)}
          {filterImg.length > showMaxSize && (
            <a className={styles.more} onClick={seeMore}>
              {more ? <FM id="aminer.common.less" defaultMessage='Less' />
                : <span><FM id="aminer.common.more" defaultMessage='More' />{`(${(filterImg.length) - 5}+)`}</span>}
            </a>
          )}
        </div>
      </div>
    )
  )
}

export default component(connect(({ auth }) => ({
  roles: auth.roles,
  user: auth.user
})))(PaperFigures)

const twoSum = (nums, target) => {
  let i = nums.length;
  while (i > 1) {
    const last = nums.pop();
    if (nums.indexOf(target - last) > -1) {
      return [nums.indexOf(target - last), nums.length];
    }
    i--
  }
};

// console.log('twoSum', twoSum([3, 3, 7, 8], 6));
