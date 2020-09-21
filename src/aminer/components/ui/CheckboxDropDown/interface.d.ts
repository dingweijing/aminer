interface IProps{
  options:Array<IOpts>,
  onChange:Function,
  checkedKeys?:Array<String>,
  value?:Array<string>
}

interface IOpts{
  label:string,
  value:string,
}

/* eslint-disable no-undef */
export { IProps, IOpts }
