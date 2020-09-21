import { pubService, paperSearchService } from 'services/aminer';


export default {

  namespace: 'pub', // TODO change to pub model.

  state: {
    paper: null,
  },

  subscriptions: {},

  effects: {

    * paperBootstrap({ payload }, { call, all }) {
      const { id, offset, size, include } = payload;
      // const [_paper, _bestpaper, _simpapers] = yield all([
      //   call(paperSearchService.searchPaperById, { id }),
      //   call(pubService.getBestPaper, { ids: [id] }),
      //   call(pubService.getSimilarPubsByPid, { id, offset, size }),
      // ]);
      // const a = {
      //   paper: _paper && _paper.data && _paper.data.items && _paper.data.items.length > 0 && _paper.data.items[0],
      //   bestpaper: _bestpaper.data && _bestpaper.data.succeed && _bestpaper.data.keyValues && _bestpaper.data.keyValues.papers,
      //   simpapers: _simpapers && _simpapers.data,
      // };
      // const [_paper, _simpapers] = yield all([
      //   call(pubService.getPaperPageData, { ids: [id], include }),
      //   call(pubService.getSimilarPubsByPid, { id, offset, size }),
      // ]);
      // const a = {
      //   paper: _paper && _paper.data && _paper.data.pub,
      //   bestpaper: _paper && _paper.data && _paper.data.bestpapers,
      //   simpapers: _simpapers && _simpapers.data,
      // };
      // return a;
      const [_paper, pdfInfo] = yield all([
        call(pubService.getPaperPageData, { ids: [id], include }),
        call(pubService.getPDFInfoByPIDs, { ids: [id] }),
        // call(pubService.getSimilarPubsByPid, { id, offset, size }),
      ]);
      // console.log('pdfInfo', pdfInfo.data && pdfInfo.data.items && pdfInfo.data.items[0]);
      const { pub = {}, bestpapers, redirect_id, notfound, cited_pubs, total_ref, total_sim } = _paper && _paper.data || {};
      const a = {
        paper: { ...pub, cited_pubs: cited_pubs && cited_pubs.total, total_ref, total_sim },
        bestpaper: bestpapers, redirect_id, notfound,
        pdfInfo: pdfInfo.data && pdfInfo.data.items && pdfInfo.data.items[0],
      };
      return a;
    },

    * searchPaperById({ payload }, { call }) {
      const { id } = payload;
      const { data } = yield call(paperSearchService.searchPaperById, { id });
      if (data && data.succeed) {
        return data && data.items && data.items.length > 0 && data.items[0];
      }
      return null;
    },

    * getSimPubs({ payload }, { call }) {
      const { data } = yield call(pubService.getSimilarPubsByPid, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getRefPubs({ payload }, { call }) {
      const { data } = yield call(pubService.getRefsByPid, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getCitePubs({ payload }, { call }) {
      const { data } = yield call(pubService.getRecentCitesByPid, payload);
      if (data) {
        return {
          data: data.items,
          count: data.keyValues && data.keyValues.total || 0
        };
      }
      return null;
    },

    * getCitePubsTopN({ payload }, { call }) {
      const { data } = yield call(pubService.getRecentCitesByPidTopN, payload);
      if (data) {
        return {
          data: data.items,
          count: data.keyValues && data.keyValues.total || 0
        };
      }
      return null;
    },

    * getPubsByPid({ payload }, { call }) {
      const { type } = payload;
      let data = null;
      if (type === 'sim') {
        data = yield call(pubService.getSimilarPubsByPid, payload);
      } else if (type === 'ref') {
        data = yield call(pubService.getRefsByPid, payload);
      } else if (type === 'cite') {
        data = yield call(pubService.getRecentCitesByPid, payload);
      }
      return data.data;
    },

    * commentPub({ payload }, { call }) {
      const { data } = yield call(pubService.commentPub, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * deleteComment({ payload }, { call }) {
      const { data } = yield call(pubService.deleteComment, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getRating({ payload }, { call }) {
      const { data } = yield call(pubService.getRating, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getUserRating({ payload }, { call }) {
      const data = yield call(pubService.getUserRating, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * saveRating({ payload }, { call }) {
      const { data } = yield call(pubService.saveRating, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getPubTag({ payload }, { call }) {
      const { data } = yield call(pubService.getPubTag, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getUserPubTag({ payload }, { call }) {
      const data = yield call(pubService.getUserPubTag, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * addTag({ payload }, { call }) {
      const { data } = yield call(pubService.addTag, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * deleteTag({ payload }, { call }) {
      const { data } = yield call(pubService.deleteTag, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * pubLike({ payload }, { call }) {
      const { data } = yield call(pubService.pubLike, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * pubUnlike({ payload }, { call }) {
      const { data } = yield call(pubService.pubUnlike, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * uploadFile({ payload }, { call }) {
      const { data } = yield call(pubService.uploadFile, payload);
      if (data) {
        return data;
      }
      return null;
    },

    // * getPaperPdf({ payload }, { call }) {
    //   const { data } = yield call(pubService.getPaperPdf, payload);
    //   if (data && data.pub && data.pub.pdf) {
    //     return data;
    //   }
    //   return null;
    // },

    * getPersonPubNum({ payload }, { call }) {
      const { data } = yield call(pubService.getPersonPubNum, payload);
      if (data && data.aggregation && data.aggregation[0] && data.aggregation[0].items) {
        return data.aggregation[0].items;
      }
      return null;
    },

    // no use
    // * getBestPaper({ payload }, { call }) {
    //   const { ids } = payload;
    //   const { data } = yield call(pubService.getBestPaper, { ids })
    //   if (data.succeed) {
    //     return data.keyValues.papers;
    //   }
    //   return false
    // },

    // * getProfile({ payload }, { call }) {
    //   yield call(pubService.getProfile, payload)
    // }

    * getPDFInfoByPIDs({ payload }, { call }) {
      const { data } = yield call(pubService.getPDFInfoByPIDs, payload);
      if (data && data.items && data.items[0]) {
        return data.items[0];
      }
      return null;
    },

    * getTopicCited({ payload }, { call }) {
      const { data } = yield call(pubService.getTopicCited, payload);
      if (data && data.data) {
        return data.data;
      }
      return null;
    },

    * updateResources({ payload }, { call }) {
      const { data } = yield call(pubService.updateResources, payload);
      if (data && data.succeed) {
        return true;
      }
      return null;
    },

    * getScholarScite({ payload }, { call }) {
      const { data } = yield call(pubService.getScholarScite, payload);
      if (data) {
        return data;
      }
      return {};
    },

    * getScholarFunding({ payload }, { call }) {
      const { data } = yield call(pubService.getScholarFunding, payload);
      if (data && data.findings) {
        return data.findings;
      }
      return null;
    },

    * setMarkErrorPicture({ payload }, { call }) {
      const { data } = yield call(pubService.setMarkErrorPicture, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * RemoveWrongImage({ payload }, { call }) {
      const { data } = yield call(pubService.RemoveWrongImage, payload);
      if (data && data.succeed) {
        return data.succeed;
      }
      return null;
    },

    * getPaperVersion({ payload }, { call }) {
      const { data } = yield call(pubService.getPaperVersion, payload);
      if (data && data.items) {
        return data.items;
      }
      return null;
    },

    * updatePubByVersion({ payload }, { call }) {
      const { data } = yield call(pubService.UpdatePubByVersion, payload);
      if (data && data.succeed) {
        return true;
      }
      return null;
    },

  },

  reducers: {
    setPaper(state, { payload: { data } }) {
      state.paper = data;
    },
  },

};
