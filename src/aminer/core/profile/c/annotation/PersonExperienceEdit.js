// import React, { useEffect, useState, useMemo, memo } from 'react';
// import { connect, component } from 'acore';
// import { Button, Checkbox, Pagination, message, Row, Col } from 'antd';
// import { AutoForm, FormItem } from 'amg/ui/form';
// import { Loading } from 'components/ui';
// import { sysconfig } from 'systems';
// import { FM, formatMessage } from 'locales';
// import { classnames } from 'utils';
// import styles from './PersonExperienceEdit.less';

// // const formItemLayout = {
// //   labelCol: { span: 4 },
// //   wrapperCol: { span: 18 },
// // };

// // const inlineFormItem = {
// //   labelCol: { span: 12 },
// //   wrapperCol: { span: 10 },
// // }
// let enMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',],
//   zhMonth = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
// const monthOptions = [];
// for (let i = 1; i <= 12; i++) {
//   monthOptions.push({
//     value: i,
//     name: sysconfig.Locale === 'en-US' ? enMonth[i - 1] : zhMonth[i - 1]
//     // name: formatMessage({ id: `aminer.person.month${i}`, defaultMessage: `${i}月` })
//   })
// }

// const PersonExperienceEdit = props => {
//   const { data = {}, onSubmit, closeEdit } = props;
//   const { weid, ...initData } = data;

//   const Submit = (values, { setSubmitting }) => {
//     setSubmitting(false);
//     if (values.isworkhere) {
//       const params = { f: 'date_e', y: 0, m: 0, tid: weid }
//       onSubmit(params, true);
//       // console.log('values', values, 'params', params); return;
//     }
//     closeEdit && closeEdit(!!weid, values.isworkhere);
//   }

//   const onBlurToSubmit = (values, e) => {
//     const { name, value } = e && e.target || {};
//     let params = { f: name, l: "en", s: value }
//     if (name === 'aff') {
//       params.t = 1;
//       if (!value || (value && !value.trim())) {
//         return;
//       }
//     }
//     if (name === 'pos') {
//       params.f = 'aff';
//       params.t = 2;
//     }
//     if (name.includes('date_s')) {
//       params = { f: 'date_s', y: Number(values['date_s_y']), m: values['date_s_m'] - 1 }
//     }
//     if (name.includes('date_e')) {
//       params = { f: 'date_e', y: Number(values['date_e_y']), m: values['date_e_m'] - 1 }
//     }
//     params.tid = weid;
//     if (onSubmit && typeof onSubmit === 'function') {
//       onSubmit(params);
//     }
//   }

//   const formSchema = [
//     {
//       name: 'aff',
//       label: formatMessage({ id: 'aminer.person.Institution', defaultMessage: 'Institution' }),
//       type: 'text',
//       rules: [{ required: true, message: 'It is required' }],
//       onBlur: onBlurToSubmit,
//     },
//     {
//       name: 'pos',
//       label: formatMessage({ id: 'aminer.person.Department', defaultMessage: 'Department' }),
//       type: 'textarea',
//       onBlur: onBlurToSubmit,
//       autoSize: true,
//     },
//     {
//       wrapperStyle: 'workingTime',
//       children: [
//         {
//           name: 'date_s_y',
//           label: formatMessage({ id: 'aminer.person.TimePeriod', defaultMessage: 'Department' }),
//           type: 'text',
//           className: 'startDate',
//           labelStyle: 'timeLabel',
//           editorStyle: 'timeEditor',
//           placeholder: '开始',
//           onBlur: onBlurToSubmit,
//         },
//         {
//           name: 'date_s_m',
//           type: 'select',
//           className: 'endDate',
//           config: {
//             option: monthOptions,
//             filterProp: 'name',
//           },
//           onBlur: onBlurToSubmit,
//           render: (props) => {
//             return (
//               <>
//                 <FormItem {...props} />
//                 <span className='separator'>~</span>
//               </>
//             )
//           }
//         },
//         {
//           name: 'date_e_y',
//           type: 'text',
//           className: 'endDate',
//           placeholder: '结束',
//           onBlur: onBlurToSubmit,
//           render: (props) => {
//             const { formikprops: { values } } = props;
//             return values.isworkhere ? '目前' : <FormItem {...props} />
//           }
//         },
//         {
//           name: 'date_e_m',
//           type: 'select',
//           className: 'endDate',
//           config: {
//             option: monthOptions,
//             filterProp: 'name',
//           },
//           onBlur: onBlurToSubmit,
//           render: (props) => {
//             const { formikprops: { values } } = props;
//             return values.isworkhere ? '' : <FormItem {...props} />
//           }
//         },
//       ]
//     },
//     {
//       name: 'isworkhere',
//       label: formatMessage({ id: 'aminer.person.workhere', defaultMessage: '仍然在职' }),
//       type: 'checkbox',
//     },
//     {
//       name: 'field',
//       label: formatMessage({ id: 'aminer.person.field', defaultMessage: 'Field' }),
//       type: 'text',
//       onBlur: onBlurToSubmit,
//     },
//     {
//       name: 'desc',
//       label: formatMessage({ id: 'aminer.annotation.description', defaultMessage: 'description' }),
//       type: 'textarea',
//       onBlur: onBlurToSubmit,
//     }
//   ];

//   const onCancle = () => {
//     closeEdit && closeEdit(!!weid);
//   }

//   if (!initData) { return null }
//   return (
//     <div className={styles.personExperienceEdit}>
//       <AutoForm
//         data={initData}
//         mode='edit'
//         onSubmit={Submit}
//         config={formSchema}
//       />
//     </div>
//   );
// }

// export default component(connect())(PersonExperienceEdit)
