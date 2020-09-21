// @ts-nocheck
import { IRoute } from '@umijs/core';
import { AnyAction } from 'redux';
import React from 'react';
import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import { match } from 'react-router-dom';
import { Location, LocationState, History } from 'history';

export * from 'D:/dingwj/src/models/acore/debug';
export * from 'D:/dingwj/src/models/acore/global';
export * from 'D:/dingwj/src/models/aedit/editEb';
export * from 'D:/dingwj/src/models/aedit/expertbaseTree';
export * from 'D:/dingwj/src/models/aiopen/cityrank';
export * from 'D:/dingwj/src/models/aiopen/company';
export * from 'D:/dingwj/src/models/aiopen/global';
export * from 'D:/dingwj/src/models/aiopen/rank';
export * from 'D:/dingwj/src/models/aminer-p/ai10_model';
export * from 'D:/dingwj/src/models/aminer/aminer-person';
export * from 'D:/dingwj/src/models/aminer/aminer-search';
export * from 'D:/dingwj/src/models/aminer/chineseMedicine';
export * from 'D:/dingwj/src/models/aminer/collection';
export * from 'D:/dingwj/src/models/aminer/common';
export * from 'D:/dingwj/src/models/aminer/conf';
export * from 'D:/dingwj/src/models/aminer/ConfirmModal';
export * from 'D:/dingwj/src/models/aminer/confrence';
export * from 'D:/dingwj/src/models/aminer/domain';
export * from 'D:/dingwj/src/models/aminer/edit-profile';
export * from 'D:/dingwj/src/models/aminer/expert_search';
export * from 'D:/dingwj/src/models/aminer/imgViewer';
export * from 'D:/dingwj/src/models/aminer/modal';
export * from 'D:/dingwj/src/models/aminer/mrt';
export * from 'D:/dingwj/src/models/aminer/newTopic';
export * from 'D:/dingwj/src/models/aminer/org';
export * from 'D:/dingwj/src/models/aminer/personal-profile';
export * from 'D:/dingwj/src/models/aminer/profile';
export * from 'D:/dingwj/src/models/aminer/pub-na';
export * from 'D:/dingwj/src/models/aminer/pub';
export * from 'D:/dingwj/src/models/aminer/rank';
export * from 'D:/dingwj/src/models/aminer/report';
export * from 'D:/dingwj/src/models/aminer/roster';
export * from 'D:/dingwj/src/models/aminer/scholars';
export * from 'D:/dingwj/src/models/aminer/searchgct';
export * from 'D:/dingwj/src/models/aminer/searchnews';
export * from 'D:/dingwj/src/models/aminer/searchpaper';
export * from 'D:/dingwj/src/models/aminer/searchperson';
export * from 'D:/dingwj/src/models/aminer/social';
export * from 'D:/dingwj/src/models/aminer/timeline';
export * from 'D:/dingwj/src/models/aminer/topic';
export * from 'D:/dingwj/src/models/aminer/venue';
export * from 'D:/dingwj/src/models/aminer/vis-research-interest';
export * from 'D:/dingwj/src/models/cooccurrence/cooccurrence';
export * from 'D:/dingwj/src/models/core/auth/auth';
export * from 'D:/dingwj/src/models/core/person/person-edit';
export * from 'D:/dingwj/src/models/core/person/person';
export * from 'D:/dingwj/src/models/core/personx/person-path';
export * from 'D:/dingwj/src/models/core/search/search-model-merge';
export * from 'D:/dingwj/src/models/core/search/search-model';
export * from 'D:/dingwj/src/models/core/search/search-modelB';
export * from 'D:/dingwj/src/models/core/search/search';
export * from 'D:/dingwj/src/models/knowledgegraph/topic';

export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

export type ImmerReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => void;

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap,
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export type Subscription = (api: SubscriptionAPI, done: Function) => void | Function;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    [key: string]: any;
  };
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
  location: Location<S> & { query: T };
  history: History;
  route: IRoute;
}

export type RequiredConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
  > = Required<ConnectProps<P, S, T>>

/**
 * @type T: React props
 * @type U: match props types
 */
export type ConnectRC<
  T = {},
  U = {},
  S = {},
  Q = {}
> = React.ForwardRefRenderFunction<any, T & RequiredConnectProps<U, S, Q>>;

