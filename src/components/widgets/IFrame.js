import React, { PureComponent } from 'react';

// TODO ! @xiaobei Finish this iframe.
window.id = ''  // todo: delete

const setIframeHeight = (e) => {
  console.log(e.data)
  // todo: 解析id, height
  const id  = window.id;
  const height = e && e.data && e.data.replace('height', '');

  const iframe = document.getElementById(id);
  if(iframe.height !== height) {
    iframe.height = height;
  }
}
export default class IFrame extends PureComponent {

  constructor(props) {
    super(props);
    this.id = this.randomWord(16);
    window.id = this.id // todo: delete
  }

  componentDidMount() {
    if (!window.iframeCount) {
      window.iframeCount = 0;
      window.addEventListener('message', setIframeHeight);
    }
    window.iframeCount += 1;
  }

  componentWillUnmount() {
    if (window.iframeCount === 1) {
      window.removeEventListener('message', setIframeHeight);
    }
    window.iframeCount -= 1;
  }

  render() {
    const { src, ...params } = this.props;
    return (
      <iframe id={this.id} height="200px"
        {...params} title="report" scrolling="no" frameBorder="0" width="100%"
        src={`${src}?id=${this.id}`}
      />
    );
  }

  randomWord = (range) => {
    let str = '';
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
      'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < range; i += 1) {
      const index = Math.round(Math.random() * (arr.length - 1));
      str += arr[index];
    }
    return str;
  };
}
