import React, { PureComponent } from 'react';
import { connect, Link, history } from 'acore';
import { sysconfig } from 'systems';
import PropTypes from 'prop-types';
import { classnames } from 'utils';
import { FM } from 'locales';
import display from 'utils/display';
import { getSearchPathname } from 'utils/search-utils'
import { Button, Popover } from 'antd';

import styles from './PersonCard.less';

const mapStateToProps = ({ scholars }, { pid }) => {
  const personData = pid && scholars && scholars.topList && scholars.topList[pid];
  if (personData) {
    return {
      personData,
    };
  }
  return {}
};

export default
@connect(mapStateToProps)
class PersonCard extends PureComponent {
  static propTypes = {
    showEndorseBtn: PropTypes.bool,
    showFollowBtn: PropTypes.bool,
    showViews: PropTypes.bool,
    imgSrcWidth: PropTypes.string,
    imgBoxStyle: PropTypes.object,
    tagClick: PropTypes.bool,
    enableImgLazyLoad: PropTypes.bool,
  };

  static defaultProps = {
    showEndorseBtn: true,
    showFollowBtn: true,
    showViews: true,
    tagClick: true,
    imgSrcWidth: '90',
    imgBoxStyle: {
      width: '90px',
      minWidth: '90px',
      height: '90px'
    }
  };

  following = () => {
    const { dispatch, personData: { id } } = this.props;
    dispatch({
      type: 'scholars/following',
      payload: { id }
    })
  }

  unfollow = () => {
    const { dispatch, personData: { id } } = this.props;
    dispatch({
      type: 'scholars/unfollow',
      payload: { id }
    })
  }

  voteup = () => {
    const { dispatch, tid, personData: { id, is_upvoted } } = this.props;
    dispatch({
      type: 'scholars/voteup',
      payload: { id, tid, is_upvoted }
    })
  }

  votedown = () => {
    const { dispatch, tid, personData: { id, is_downvoted } } = this.props;
    dispatch({
      type: 'scholars/votedown',
      payload: { id, tid, is_downvoted }
    })
  }


  onSearch = (query) => {
    const { dispatch } = this.props;
    dispatch({ type: 'searchmodel/toggleAdvancedSearch', payload: true })
    history.push(getSearchPathname(query));
  }

  render() {
    let { personData, person } = this.props;
    if (person) {
      personData = person
    }

    const { imgBoxStyle, imgSrcWidth, showEndorseBtn, showFollowBtn, showViews, tagClick } = this.props;
    const { enableImgLazyLoad, setRef, lazyLoaderId, index } = this.props; // lazyImageLoader
    const avatar = personData && display.personAvatar(personData.avatar, 0, imgSrcWidth);
    const imgprops = {
      src: enableImgLazyLoad ? display.DefaultAvatar : avatar,
      ref: setRef,
      [`ll${lazyLoaderId}`]: index,
    }

    if (personData) {
      return (
        <div className={styles.carousel}>
          {showEndorseBtn && (
            <div className={styles.endorseGrougp}>
              <Popover placement="topLeft" content={<span>Endorse {personData.name && personData.name.replace(/ .*/, '')} on theory</span>}>
                <div className={classnames(styles.upGroup, { [styles.checked]: personData.is_upvoted })} onClick={this.voteup}>
                  <Button className={classnames(styles.endorseBtn, styles.endorseCount)}>
                    {personData.num_upvoted || 0}
                  </Button>
                  <Button className={classnames(styles.endorseBtn, styles.upBtn, styles.endorseSort)}>
                    <i className="fa fa-sort-up" />
                  </Button>
                </div>
              </Popover>
              <Button className={classnames(styles.endorseBtn, styles.downBtn, styles.endorseSort, { [styles.checked]: personData.is_downvoted })} onClick={this.votedown}>
                <i className="fa fa-sort-down" />
              </Button>
            </div>
          )}

          <div className={styles.imgBox} style={imgBoxStyle}>
            {/* <img src={(personData.avatar && !imgLazyLoad) ? `https:${personData.avatar.replace(/static\.aminer\..+?(?=\/)/, 'avatarcdn.aminer.cn')}!${imgSrcWidth}` : 'https://avatarcdn.aminer.cn/default/default.jpg'} alt="" eid={index} /> */}

            <a href={`/profile/${personData.id}`} target='_black'>
              <img {...imgprops} alt='' />
            </a>

          </div>

          <div className={styles.content}>
            <h6 className={styles.title}>
              <a href={`/profile/${personData.id}`} target='_black'>
                <strong>{personData.name}{personData.name_zh && `(${personData.name_zh})`}</strong>
              </a>

              {/* <i className={classnames('fa fa-check-circle-o', { [styles.bind]: personData.bind })} /> */}
            </h6>
            <p className={styles.statsLine}>
              <span className={styles.statst}><em>h</em>-index：</span>
              <span>{personData.indices ? personData.indices.h_index : 0}</span>
              <span className={styles.split}>|</span>
              <span className={styles.statst}>
                <FM id="aminer.common.paper" defaultMessage='#Paper' />：
              </span>

              <span>{personData.indices ? personData.indices.num_pubs : 0}</span>
              <span className={styles.split}>|</span>
              <span className={styles.statst}>
                <FM id="aminer.common.citation" defaultMessage='#Citation' />：
              </span>

              <span>{personData.indices ? personData.indices.num_citation : 0}</span>
            </p>
            {personData.pos && personData.pos[0] && (
              <p>
                <i className="fa fa-briefcase" />
                <span>{personData.pos[0].n || personData.pos[0].n_zh}</span>
              </p>
            )}

            {personData.aff && personData.aff.desc && (
              <p className={styles.black}>
                <i className="fa fa-map-marker" />
                <span>{personData.aff.desc}</span>
              </p>
            )}

            {personData.tags && personData.tags.length !== 0 && (
              <p className={styles.tags}>
                {personData.tags && personData.tags.slice(0, 8).map(tag => {
                  if (tagClick) {
                    return (
                      <button type="button" className={styles.tag} key={tag.t} onClick={this.onSearch.bind(this, tag.t)}>
                        <span>
                          {tag.t}
                        </span>
                      </button>
                    )
                  } else {
                    return (
                      <span className={styles.distag} key={tag.t}>
                        <span>
                          {tag.t}
                        </span>
                      </span>
                    )
                  }

                })}
              </p>
            )}

            {showViews && (
              <p className={styles.views}>
                <i className="fa fa-eye" />
                <span>{personData.num_viewed || 0}</span>
                <FM id="aminer.common.views" defaultMessage='views' />
              </p>
            )}
          </div>

          {showFollowBtn && personData.is_following && (
            <div className={styles.followBtns} onClick={this.unfollow}>
              <Button className={styles.followingBtn}>
                <i className={classnames('fa fa-check', styles.icon)} />
                <FM id="aminer.person.following" defaultMessage='Following' />
                <span> | </span>
                <span>{personData.num_followed || 0}</span>
              </Button>
              <Button className={styles.unfollowBtn}>
                <i className={classnames('fa fa-user-times', styles.icon)} />
                <FM id="aminer.person.unfollow" defaultMessage='Unfollow' />
              </Button>
            </div>
          )}

          {showFollowBtn && !personData.is_following && (
            <Button className={styles.followBtn} onClick={this.following}>
              <i className={classnames('fa fa-user-plus', styles.icon)} />
              <FM id="aminer.person.follow" defaultMessage='Follow' />
              <span> | </span>
              <span>{personData.num_followed || 0}</span>
            </Button>
          )}
        </div>
      )
    } else {
      return <></>
    }

  }
}
