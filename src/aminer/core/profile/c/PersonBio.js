import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { formatMessage } from 'locales'
import classnames from 'classnames';
import { Input } from 'antd';
import styles from './information.less';

const { TextArea } = Input;

@connect(({ aminerPerson }) => ({ profile: aminerPerson.profile }))
class Bio extends PureComponent {
  reviseBio = () => {
    const { profile, dispatch } = this.props;
    console.log('profile', profile.profile.bio.replace(/<br \/>/g, '\n'));
    const bio = profile.profile && profile.profile.bio;

    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.person.bio', defaultMessage: 'Bio' }),
        showFooter: true,
        extraArticleStyle: { padding: '20px 50px' },
        content: <Bibtex id={profile.id} bibtex={data} />,
        handelOk: () => {
          console.log('handelOk')
        },
      }
    })
    //   content: () => {
    //     return (
    //       // <TextArea placeholder="todo" autoSize defaultValue={bio} disabled />
    //       // <Bio />
    //       editContent(`${bio}${bio}${bio}`, false)
    //     )
    //   },
  }

  render() {
    const { profile } = this.props;

    const bio = profile.profile && profile.profile.bio;
    let newBio = [];
    if (profile.profile && profile.profile.bio) {
      newBio = bio.split('<br />');
    }
    return (
      <>
        {profile && (
          <div className={classnames(styles.profile_info, 'container-wrong')}>
            <div className={styles.info_zone}>
              <div className={styles.title}>
                <h2>Bio</h2>
                <span className={styles.opr}>
                  <i className="fa fa-edit fa-fw" onClick={this.reviseBio} />
                </span>
              </div>
              <div className={styles.spliter} />
              <div className={styles.content}>
                {editContent(bio)}
                {/* {bio && (
                  <div>
                    {newBio.map((item, index) => {
                      return (
                        <div key={index}>
                          <p>{item}</p>
                        </div>
                      );
                    })}
                  </div>
                )} */}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Bio;

const editContent = (text, isReadonly = true) => {
  if (!text) {
    return false
  }
  return (
    <div>
      {/* style={{ padding: '20px 50px' }} */}
      <TextArea placeholder="aaa" autoSize
        defaultValue={text.replace(/<br \/>/g, '\n')}
        readOnly={isReadonly}
      />
    </div>
  )
}
