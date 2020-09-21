import React, { useEffect } from "react";
import { FM, formatMessage } from "locales";
import { classnames } from "utils";
import { AuthorCluster } from "./c/TopicClusterType";
import { PersonItem } from "aminer/p/user/components";
import PersonList from "aminer/components/expert/PersonList.tsx";
import styles from "./AuthorList.less";

interface Proptypes {
  authorList: AuthorCluster[];
}

const AuthorList: React.FC<Proptypes> = (props) => {
  const { authorList } = props;

  const contentBottomZone = [
    ({ person }: { person: AuthorCluster }) => {
      return <span className="count">Paper {person.count}</span>;
    },
  ];

  return (
    <div>
      {authorList?.length && (
        <div className={styles.topic_author}>
          <div className="legend">
            <FM id="aminer.topic.authors" />
          </div>
          <div className="author_list">
            {/* {authorList.slice(0, 10).map((expert) => ( */}
            <PersonList
              id="topicPersonList"
              target="_blank"
              // key={expert.id}
              persons={authorList.slice(0, 10)}
              followSize="small"
              contentBottomZone={contentBottomZone}
              showViews={false}
              indicesZone={[]}
              // contentRightZone={[]}
            />
            {/* ))} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorList;
