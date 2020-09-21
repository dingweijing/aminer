// let fundebug;

// **** 『 fundebug 』 *******************************

let fundebug;
if (false && process.env.NODE_ENV === 'production') {
  try {
    import('fundebug-javascript' /* webpackChunkName:"online-tool" */).then(
      f => {
        fundebug = f;
        // ! 暂时屏蔽了，这个东西目前不好用。
        fundebug.apikey = '437067772d9421376819aa69bef45e9c17818b3b248924e62bf472a4a4c66618';
        fundebug.setHttpBody = true;
      }
    );
  } catch (e) {
    console.warn(e);
  }
}

const logFundebug = (event, info) => {
  if (process.env.NODE_ENV === 'production') {
    if (fundebug) {
      const infoStr = info || '';
      fundebug.notifyError(event, {
        metaData: {
          info: infoStr,
        },
      });
    }
  }
};

export { fundebug, logFundebug };
