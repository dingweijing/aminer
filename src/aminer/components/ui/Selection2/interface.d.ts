interface ISubOpts{
  label:string;
  label_zh:string;
  value?:any;
}

interface IOpts{
  label?:string;
  label_zh?:string,
  key:string;
  single?:boolean;
  opts:Array<ISubOpts>;
  direction?:'row'|'column',
}


interface IOptions{
  options:Array<IOpts>;
  selectedKeys:Object;
  onSelectChange:Function;
  isMobile?:boolean;
}

/* eslint-disable no-undef */
export { IOptions, IOpts, ISubOpts }
