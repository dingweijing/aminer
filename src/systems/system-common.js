import React from 'react';
import { toIDDotString, TopExpertBase } from 'consts/expert-base';

export const CommonQuickSearchList = [
  { name: 'data mining', name_zh: '' },
  { name: 'machine learning', name_zh: '' },
  { name: 'social network', name_zh: '' },
  { name: 'deep learning', name_zh: '' },
  { name: 'healthcare', name_zh: '' },
  { name: 'organic light-emitting diodes', name_zh: '' },
  { name: 'Tim Berners-Lee', name_zh: '' },
  { name: 'Jon Kleinberg', name_zh: '' },
  { name: 'Jiawei Han', name_zh: '' },
  { name: 'Geoffrey Hinton', name_zh: '' },
];

export const Common2BSearchFilterEBs = [
  {
    id: 'aminer', // aminer 是特殊的，代表全球专家；搜索时会清空filter；
    name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
    show: role => true, // show 方法根据role来判断是否要显示在filter中；
  },
  {
    id: toIDDotString(TopExpertBase.ACMFellow),
    ebids: TopExpertBase.ACMFellow, // ebids 是当这个Group有多个智库ID的时候，这里放数组;
    name: 'ACM Fellow',
    nperson: 53 + 809,
  },
  {
    id: TopExpertBase.IEEEFellow[0].id,
    ebids: TopExpertBase.IEEEFellow,
    name: 'IEEE Fellow', // (2013-2016)
    nperson: 0,
  },
  {
    id: '55ebd8b945cea17ff0c53d5a',
    // ebids: [{ id: '55ebd8b945cea17ff0c53d5a', name: '中国科学院院士' }], // no ebids, use default.
    name: '中国科学院院士',
    nperson: 287,
  },
  {
    id: '5912aa3a9ed5db655182ffde',
    name: '美国科学院外国专家',
    nperson: 287,
  },
  {
    id: '590fcaa59ed5db67cf85a129',
    name: '美国科学院',
    nperson: 2206,
  },
  {
    id: '5923c0829ed5db1600b942db',
    name: '英国皇家科学院－Research Fellows Directory',
    nperson: 976,
  },
  {
    id: '5923bfee9ed5db1600b941f2',
    name: '英国皇家科学院－Fellows Directory',
    nperson: 287,
  },
];
