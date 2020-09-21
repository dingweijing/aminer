import React, { useEffect, useState, Dispatch } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import {
  IKeywordSuggest,
  IKeyword,
  IKeywordSocial,
  IUserInfo,
} from 'aminer/components/common_types';
import { isLogin } from 'utils/auth';
import { Input, AutoComplete, message } from 'antd';
import { SelectProps } from 'antd/es/select';
import styles from './Suggest.less';

const { Option } = AutoComplete;

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  selectTopics: IKeywordSocial[];
  defaultTopics: IKeyword[];
  userinfo: IUserInfo;
  follow_loading: boolean;
  setFollowLoading: Dispatch<boolean>;
  onSelectChange: () => void;
}

interface ISelectItem {
  disable: boolean;
  value: string;
  text: string;
}

const handleResult = (topics: IKeywordSuggest[], selectTopics: IKeywordSocial[]) => {
  const selects = selectTopics?.map(item => (item.input_name || item.name || '').toLowerCase());
  return topics.map(topic => ({
    disable: selects?.includes(topic.text.toLowerCase()),
    value: JSON.stringify(topic),
    text: topic.text,
  }));
};

let timer: NodeJS.Timer;
const Suggest: React.FC<IPropTypes> = props => {
  const {
    dispatch,
    selectTopics,
    defaultTopics,
    follow_loading,
    setFollowLoading,
    userinfo,
    onSelectChange,
  } = props;
  const [text, setValue] = useState<string>('');
  const [options, setOptions] = useState<SelectProps<ISelectItem>[]>([]);

  const is_login = isLogin(userinfo);

  const getSuggestTopics = (value: string) => {
    if (!value.trim()) {
      setOptions([]);
      return;
    }
    dispatch({
      type: 'social/SuggestTopics',
      payload: {
        query: value,
      },
    }).then((topics: IKeywordSuggest[]) => {
      const suggest_topics = topics ? handleResult(topics, selectTopics) : [];
      const results = suggest_topics.filter(item => item.text);
      setOptions(results);
    });
  };

  const handleSearch = (value: string) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      getSuggestTopics(value);
    }, 300);
  };

  const addSelected = async (topic: IKeywordSuggest) => {
    if (!is_login) {
      dispatch({ type: 'modal/login' });
      return;
    }
    if (follow_loading) {
      return;
    }
    setFollowLoading(true);
    const selects = selectTopics?.map(item => (item.input_name || item.name || '').toLowerCase());
    if (selects?.includes((topic?.text || '').toLowerCase())) {
      message.warn(formatMessage({ id: 'aminer.user.topic.exist' }));
      setValue('');
      setFollowLoading(false);
      setOptions([]);
      return;
    }

    const new_topic_id = await dispatch({
      type: 'social/FollowTopic',
      payload: {
        name: topic.text || '',
        op: '',
      },
    });
    if (new_topic_id) {
      message.success({
        content: formatMessage({ id: 'aminer.common.add.success' }),
        key: 2,
        duration: 1,
      });
      await dispatch({
        type: 'social/addSelectedTopics',
        payload: {
          topic: {
            id: new_topic_id,
            name: topic?.text || '',
          },
        },
      });
      setValue('');
      setOptions([]);
      setFollowLoading(false);

      if (onSelectChange) {
        onSelectChange();
      }
    }
  };

  const onChange = (value: string) => {
    setValue(value);
  };

  const onSelect = (value: string) => {
    // console.log('value', value)
    // addSelected(JSON.parse(value));
    addSelected({ text: value });
  };
  const onAdd = () => {
    if (text.trim()) {
      addSelected({ text });
    }
  };

  useEffect(() => {
    // getExpertisedTopics();
  }, []);

  return (
    <section className={classnames(styles.suggest)}>
      <AutoComplete
        value={text}
        // dropdownMatchSelectWidth={252}
        style={{ width: '100%', height: '32px' }}
        dataSource={options.map(renderOption)}
        onChange={onChange}
        onSelect={onSelect}
        onSearch={handleSearch}
        defaultOpen={false}
        optionLabelProp="value"
      />
      <div className="add_btn">
        <Input.Search
          // size="large"
          onSearch={onAdd}
          placeholder={formatMessage({ id: 'com.RgSearchTermBox.placeholder' })}
          enterButton={formatMessage({ id: 'aminer.social.suggestbtn' })}
        />
      </div>
    </section>
  );
};

export default component(
  connect(({ auth, social, loading }) => ({
    user: auth.user,
    defaultTopics: social.defaultTopics,
    selectTopics: social.selectTopics,
  })),
)(Suggest);

const renderOption = (item: ISelectItem) => {
  const { text, disable } = item;
  return (
    <Option key={text} disabled={disable}>
      <div className="global-search-item">{text}</div>
    </Option>
  );
};
