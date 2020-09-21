// import { isBrowser } from 'umi'
const { UMI_ENV, NODE_ENV } = process.env;

const LocalPublicPath = (UMI_ENV === 'dev' || NODE_ENV === 'development')
  ? '/public/' // 临时修复一下SSR dev模式下不好使的问题。
  : process.env.publicPath || '/';

export default {
  HeaderTitle: '',

  AMinerURL: 'https://aminer.cn', // basePageURL,
  AMinerOldAPIDomain: 'https://api.aminer.cn',

  // Resource path
  ResourcePath: 'https://originalfileserver.aminer.cn', // 大部分静态资源是放在这个ftp下的。

  Fileserver: 'fileserver.aminer.cn',

  LocalPublicPath,

  // 是否是在服务端渲染.
  // IsServerRender: () => (window && window.SSR_RENDER) || false,
  IsServerRender: () => {
    const iS = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined'
    return !iS
  },


  // IsServerRender: () => {
  //   // TODO: 这里后面调整成以前的判断方式，小北
  //   // console.log('isBrowser', );
  //   return  false
  // },

  // seo related
  titleSuffix: '',


  // DEVELOPMENT VAREABLES
  DEV_MODE: true,

};
