import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import { FM } from 'locales';
import { Button } from 'antd';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import styles from './PersonFollow.less';

const PaperMark = props => {
  const { paper, dispatch, user, paperAllLiked } = props;
  const { is_starring, num_starred, id } = paper;
  const [isStarring, setIsStarring] = useState(is_starring);
  const [numStarred, setNumStarred] = useState(num_starred);

  useEffect(() => {
    const likeIds = paperAllLiked && paperAllLiked.length > 0 ? paperAllLiked.map(n => n.id) : [];
    setIsStarring(likeIds.includes(id));
  }, [paperAllLiked]);

  const paperMark = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'searchpaper/paperMark',
        payload: { id, paper },
      }).then(({ data, success }) => {
        if (success) {
          setNumStarred(num_starred + 1);
          setIsStarring(!isStarring);
        }
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const paperUnMark = () => {
    dispatch({
      type: 'searchpaper/paperUnMark',
      payload: { id, paper },
    }).then(({ data, success }) => {
      if (success) {
        setNumStarred(num_starred - 1);
        setIsStarring(!isStarring);
      }
    });
  };

  return (
    <div className={styles.personFollow}>
      {isStarring && (
        <div className={styles.followBtns}>
          <div className={styles.btnContent}>
            <Button className={classnames(styles.fbtn, styles.following)}>
              <div className={styles.left}>
                <FM id="aminer.paper.marked" defaultMessage="Marked" />
              </div>
              <span className={styles.split}></span>
              <div className={styles.right}>
                <span className={styles.number}>{num_starred || 0}</span>
              </div>
            </Button>
          </div>

          <div className={classnames(styles.btnContent, styles.absolute)}>
            {/* 占位隐藏：unfollow 和 folling 一样宽 */}
            <Button className={classnames(styles.fbtn, styles.following, styles.visibility)}>
              <div className={styles.left}>
                <FM id="aminer.paper.marked" defaultMessage="Marked" />
              </div>
              <span className={styles.split}></span>
              <div className={styles.right}>
                <span className={styles.number}>{num_starred || 0}</span>
              </div>
            </Button>
            <Button
              className={classnames(styles.fbtn, styles.unfollow, styles.i)}
              onClick={paperUnMark}
            >
              <div className={styles.left}>
                <FM id="aminer.paper.unmark" defaultMessage="Unmark" />
              </div>
            </Button>
          </div>
        </div>
      )}

      {!isStarring && (
        <div className={styles.btnContent}>
          <Button className={classnames(styles.fbtn, styles.follow)} onClick={paperMark}>
            <div className={styles.left}>
              <i className={classnames('fa fa-plus', styles.icon)} />
              <FM id="aminer.paper.mark" defaultMessage="Mark" />
            </div>
            {!!num_starred && (
              <>
                <span className={styles.split}></span>
                <div className={styles.right}>
                  {num_starred && <span className={styles.number}>{num_starred}</span>}
                </div>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default component(
  connect(({ searchpaper, auth }) => ({
    paperAllLiked: searchpaper.paperAllLiked,
    user: auth.user,
  })),
)(PaperMark);
