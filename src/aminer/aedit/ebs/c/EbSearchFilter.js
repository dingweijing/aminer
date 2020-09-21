import React, { useState, useEffect, useRef } from 'react';
import { Switch } from 'antd';
import { component } from 'acore';
import { AutoForm } from 'amg/ui/form';
import EditGenderLang from './EditGenderLang';
import { SearchComponentDynamic as SearchComponent } from 'aminer/core/search/c';
import styles from './EbSearchFilter.less';

const EbSearchFilter = props => {
  const { id } = props;

  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery('');
  }, [id]);

  const onSubmit = ({ name }) => {
    const v = name && name.trim() || '';
    setQuery(v);
  }

  const formSchema = [
    {
      name: 'name',
      type: 'text',
      label: '',
      editorStyle: 'searchEbQuery',
      placeholder: 'search name'
    },
  ]

  const personContentBottomZone = [
    ({ person }) => {
      return <EditGenderLang ebId={id} person={person} />
    }
  ]

  return (
    <div className={styles.ebSearchFilter}>
      <AutoForm
        layout='inline'
        config={formSchema}
        data={{ name: query }}
        okText='Search'
        onSubmit={onSubmit}
      />
      <SearchComponent
        hideSearchAssistant={true}
        ebId={id}
        mode='table'
        personContentBottomZone={personContentBottomZone}
        query={{ query }}
      />
    </div>
  )
}

export default component()(EbSearchFilter)
