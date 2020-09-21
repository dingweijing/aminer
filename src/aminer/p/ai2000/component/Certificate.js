import React, { useState } from 'react';
import { component, connect } from 'acore';
import consts from 'consts';
import PropTypes from 'prop-types';
import { FM } from 'locales';
import { Button } from 'antd';
import { loadHtml2canvas, loadSaveAs } from 'utils/requirejs';
import { classnames } from 'utils';
import styles from './Certificate.less';

const Certificate = props => {
  const { award_path, pid, dispatch } = props;
  const [loading, setLoading] = useState();

  const openImage = () => {
    dispatch({
      type: 'imgViewer/open',
      payload: {
        src: award_path,
        intro: '',
      },
    });
  };

  if (!award_path) {
    return false;
  }
  return (
    <div className={classnames(styles.certificate, 'certificate')}>
      {/* <span
        className="download_certificate"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          exportCanvasAsPNG(
            `${award_path}`,
            setLoading,
          );
        }}
      >
        <FM id="ai2000.download.certificate" defaultMessage="Download Certificate" />
        {loading && (
          <em className="please_wait">
            <FM id="ai2000.download.wait" defaultMessage="Please Wait" />
          </em>
        )}
      </span> */}
      {/* <div id="certificate_image_box">
        <img src="certificate_image" alt=""/>
      </div> */}

      <Button
        className={classnames('download_certificate', styles.fbtn)}
        onClick={openImage}
      >
        {/* <div className="certificate_image_box" id={`certificate_image_box_${pid}`}>
          <img src={award_path} alt="" />
        </div> */}
        <FM id="ai2000.download.certificate" defaultMessage="Download Certificate" />
        {/* {loading && ( */}
        {/* <em className="please_wait">
            <FM id="ai2000.download.wait" defaultMessage="Please Wait" />
          </em> */}
        {/* )} */}
        {/* <canvas width="200" height="300" id={`canvas_${pid}`}></canvas> */}
      </Button>
    </div>
  );
};

Certificate.propTypes = {
  award_path: PropTypes.string.isRequired,
};

export default component(connect())(Certificate);

// const exportCanvasAsPNG = (scr, setLoading, pid) => {
//   // const img = new Image();
//   // img.src = scr;
//   // const img = document.getElementById(`certificate_image_box_${pid}`);
//   // img.style.width = '300px';
//   // img.style.position = 'fixed';
//   // img.style.top = '-9999px';
//   // img.src = scr;

//   // console.log('img', img);
//   // // img.style.visibility = 'hidden';
//   // // img.style.bottom = '-100000px';
//   // document.body.appendChild(img);

//   // if (!img) return;
//   setLoading(true);
//   // console.log('getBoundingClientRect', img.getBoundingClientRect());

//   setTimeout(() => {
//     // const width = img.offsetWidth; //dom宽
//     // const height = img.offsetHeight; //dom高
//     // 解决图片模糊
//     // const scale = 2; //放大倍数
//     let img = new Image();
//     img.src = scr;
//     const canvas = document.getElementById('test_canvas');
//     // document.getElementById('root').insertBefore(canvas, document.getElementsByClassName('mainlayout')[0]);
//     // canvas.width = 200;
//     // canvas.height = 300;
//     // canvas.style.width = '200px';
//     // canvas.style.height = '300px';
//     const context = canvas.getContext('2d');
//     // context.scale(scale, scale);
//     // //设置context位置，值为相对于视窗的偏移量负值，让图片复位(解决偏移的重点)
//     // const rect = img.getBoundingClientRect(); //获取元素相对于视察的偏移量
//     // context.translate(-rect.left, -rect.top);
//     console.log('img', img);
//     context.drawImage(scr, 200, 300);

//     // downLoadImg(canvas, setLoading);

//     // const opts = {
//     //   canvas: canvas,
//     //   timeout: 2000,
//     //   allowTaint: true,
//     //   useCORS: true, // 【重要】开启跨域配置
//     //   scrollY: 0, // 纵向偏移量 写死0 可以避免滚动造成偶尔偏移的现象
//     //   backgroundColor: '#fff',
//     // };
//     // img.setAttribute('crossOrigin', 'anonymous');
//     // loadHtml2canvas(html2canvas => {
//     //   html2canvas(img, opts).then(_canvas => {
//     //     console.log('_canvas', _canvas);
//     //     document.body.appendChild(_canvas);
//     //     // downLoadImg(canvas, setLoading);
//     //     // document.body.removeChild(img);
//     //   });
//     // });
//   }, 2000);
// };

// const downLoadImg = (canvas, setLoading) => {
//   const imgURL = canvas.toDataURL('image/png');
//   // 移动端长按保存图片 PC端直接下载
//   // if (isMobile()) {
//   //   setImgSrc(imgURL);
//   //   // 移动端弹框放生成的图片 <img src={imgSrc} className={styles.downloadImg} />
//   // } else {
//   const filename = `certificate.jpg`;
//   loadSaveAs(saveAs => {
//     saveAs(imgURL, filename);
//     setLoading(false);
//   });
//   // }
// };
