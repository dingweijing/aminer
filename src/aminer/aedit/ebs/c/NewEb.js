import React, { useState } from 'react';
import { component } from 'acore';
import { DatePicker } from 'antd';
import { AutoForm, FormItem } from 'amg/ui/form';
import moment from 'moment';
import { formatMessage, FM } from 'locales';
import styles from './NewEb.less';

const formSchema = [
  {
    name: 'title',
    type: 'text',
    label: '手机号',
    rules: [{ required: true, type: 'phone' }],
  },
  {
    name: 'desc',
    type: 'textarea',
    label: <FM id='aminer.annotation.description' />,
    rules: [{ required: true }],
    autoSize: { minRows: 4 },
  },
  {
    name: 'gender',
    type: 'checkboxGroup',
    label: "是否",
    options: [
      { label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },
    ]
  },
  {
    name: 'sex',
    label: 'sex',
    type: 'select',
    config: {
      mode: 'tags',
      options: [
        { value: '', name: 'unknow' },
        { value: 'male', name: 'male' },
        { value: 'female', name: 'female' },
      ],
    },
  },
  {
    name: 'type',
    type: 'radio',
    label: 'Visibility Level',
    options: [
      { label: 'Private', value: 'private' },
      { label: 'Public', value: 'public' },
    ],
  },
  {
    name: 'address',
    type: 'cascader',
    label: '地区',
    options: [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ]
  },
  {
    name: 'date',
    type: 'date',
    label: 'Date',
    rules: [{ required: true }],
    render: (props, callback) => {
      return (
        <FormItem {...props}>
          <DatePicker {...callback} format="YYYY-MM-DD" />
        </FormItem>
      )
    }
  },
]

const NewEb = props => {
  const [initData, setInitData] = useState({
    title: '', desc: '', gender: ['Pear'], date: '2020-05-06',
    sex: [], type: 'private',address: [],
    // type: 'private', 
    // file: '',
  });

  const submit = (values) => {
    values.date = values.date ? moment(values.date).format('YYYY-MM-DD') : '';
    console.log('submit', JSON.stringify(values, null, "\t")); // JSON.stringify(values, null, "\t")
  }

  return (
    <div className={styles.newEb}>
      <AutoForm
        config={formSchema}
        data={initData}
        onSubmit={submit}
      />
    </div>
  )
}


export default component()(NewEb)
