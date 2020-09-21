// @ts-nocheck
import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from 'D:/dingwj/node_modules/dva-loading/dist/index.esm.js';
import { plugin, history } from '../core/umiExports';

let app:any = null;

export function _onCreate(options = {}) {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(typeof window !== 'undefined' && window.g_useSSR ? { initialState: window.g_initialProps } : {}),
    ...(options || {}),
  });
  
  app.use(createLoading());
  app.use(require('D:/dingwj/node_modules/dva-immer/dist/index.js')());
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  app.model({ namespace: 'debug', ...(require('D:/dingwj/src/models/acore/debug.js').default) });
app.model({ namespace: 'global', ...(require('D:/dingwj/src/models/acore/global.js').default) });
app.model({ namespace: 'editEb', ...(require('D:/dingwj/src/models/aedit/editEb.js').default) });
app.model({ namespace: 'expertbaseTree', ...(require('D:/dingwj/src/models/aedit/expertbaseTree.js').default) });
app.model({ namespace: 'cityrank', ...(require('D:/dingwj/src/models/aiopen/cityrank.ts').default) });
app.model({ namespace: 'company', ...(require('D:/dingwj/src/models/aiopen/company.js').default) });
app.model({ namespace: 'global', ...(require('D:/dingwj/src/models/aiopen/global.js').default) });
app.model({ namespace: 'rank', ...(require('D:/dingwj/src/models/aiopen/rank.js').default) });
app.model({ namespace: 'ai10_model', ...(require('D:/dingwj/src/models/aminer-p/ai10_model.js').default) });
app.model({ namespace: 'aminer-person', ...(require('D:/dingwj/src/models/aminer/aminer-person.js').default) });
app.model({ namespace: 'aminer-search', ...(require('D:/dingwj/src/models/aminer/aminer-search.js').default) });
app.model({ namespace: 'chineseMedicine', ...(require('D:/dingwj/src/models/aminer/chineseMedicine.js').default) });
app.model({ namespace: 'collection', ...(require('D:/dingwj/src/models/aminer/collection.ts').default) });
app.model({ namespace: 'common', ...(require('D:/dingwj/src/models/aminer/common.js').default) });
app.model({ namespace: 'conf', ...(require('D:/dingwj/src/models/aminer/conf.js').default) });
app.model({ namespace: 'ConfirmModal', ...(require('D:/dingwj/src/models/aminer/ConfirmModal.js').default) });
app.model({ namespace: 'confrence', ...(require('D:/dingwj/src/models/aminer/confrence.js').default) });
app.model({ namespace: 'domain', ...(require('D:/dingwj/src/models/aminer/domain.js').default) });
app.model({ namespace: 'edit-profile', ...(require('D:/dingwj/src/models/aminer/edit-profile.js').default) });
app.model({ namespace: 'expert_search', ...(require('D:/dingwj/src/models/aminer/expert_search.ts').default) });
app.model({ namespace: 'imgViewer', ...(require('D:/dingwj/src/models/aminer/imgViewer.js').default) });
app.model({ namespace: 'modal', ...(require('D:/dingwj/src/models/aminer/modal.js').default) });
app.model({ namespace: 'mrt', ...(require('D:/dingwj/src/models/aminer/mrt.js').default) });
app.model({ namespace: 'newTopic', ...(require('D:/dingwj/src/models/aminer/newTopic.js').default) });
app.model({ namespace: 'org', ...(require('D:/dingwj/src/models/aminer/org.js').default) });
app.model({ namespace: 'personal-profile', ...(require('D:/dingwj/src/models/aminer/personal-profile.js').default) });
app.model({ namespace: 'profile', ...(require('D:/dingwj/src/models/aminer/profile.js').default) });
app.model({ namespace: 'pub-na', ...(require('D:/dingwj/src/models/aminer/pub-na.js').default) });
app.model({ namespace: 'pub', ...(require('D:/dingwj/src/models/aminer/pub.js').default) });
app.model({ namespace: 'rank', ...(require('D:/dingwj/src/models/aminer/rank.js').default) });
app.model({ namespace: 'report', ...(require('D:/dingwj/src/models/aminer/report.js').default) });
app.model({ namespace: 'roster', ...(require('D:/dingwj/src/models/aminer/roster.js').default) });
app.model({ namespace: 'scholars', ...(require('D:/dingwj/src/models/aminer/scholars.js').default) });
app.model({ namespace: 'searchgct', ...(require('D:/dingwj/src/models/aminer/searchgct.js').default) });
app.model({ namespace: 'searchnews', ...(require('D:/dingwj/src/models/aminer/searchnews.js').default) });
app.model({ namespace: 'searchpaper', ...(require('D:/dingwj/src/models/aminer/searchpaper.js').default) });
app.model({ namespace: 'searchperson', ...(require('D:/dingwj/src/models/aminer/searchperson.js').default) });
app.model({ namespace: 'social', ...(require('D:/dingwj/src/models/aminer/social.ts').default) });
app.model({ namespace: 'timeline', ...(require('D:/dingwj/src/models/aminer/timeline.js').default) });
app.model({ namespace: 'topic', ...(require('D:/dingwj/src/models/aminer/topic.js').default) });
app.model({ namespace: 'venue', ...(require('D:/dingwj/src/models/aminer/venue.js').default) });
app.model({ namespace: 'vis-research-interest', ...(require('D:/dingwj/src/models/aminer/vis-research-interest.js').default) });
app.model({ namespace: 'cooccurrence', ...(require('D:/dingwj/src/models/cooccurrence/cooccurrence.js').default) });
app.model({ namespace: 'auth', ...(require('D:/dingwj/src/models/core/auth/auth.js').default) });
app.model({ namespace: 'person-edit', ...(require('D:/dingwj/src/models/core/person/person-edit.js').default) });
app.model({ namespace: 'person', ...(require('D:/dingwj/src/models/core/person/person.js').default) });
app.model({ namespace: 'person-path', ...(require('D:/dingwj/src/models/core/personx/person-path.js').default) });
app.model({ namespace: 'search-model-merge', ...(require('D:/dingwj/src/models/core/search/search-model-merge.js').default) });
app.model({ namespace: 'search-model', ...(require('D:/dingwj/src/models/core/search/search-model.js').default) });
app.model({ namespace: 'search-modelB', ...(require('D:/dingwj/src/models/core/search/search-modelB.js').default) });
app.model({ namespace: 'search', ...(require('D:/dingwj/src/models/core/search/search.js').default) });
app.model({ namespace: 'topic', ...(require('D:/dingwj/src/models/knowledgegraph/topic.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  constructor(props: any) {
    super(props);
    // run only in client, avoid override server _onCreate()
    if (typeof window !== 'undefined') {
      _onCreate();
    }
  }

  componentWillUnmount() {
    let app = getApp();
    app._models.forEach((model:any) => {
      app.unmodel(model.namespace);
    });
    app._models = [];
    try {
      // 释放 app，for gc
      // immer 场景 app 是 read-only 的，这里 try catch 一下
      app = null;
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
