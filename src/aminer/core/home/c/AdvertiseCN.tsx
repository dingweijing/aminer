import React, { } from 'react';
import { component } from 'acore';
import consts from 'consts';
import styles from './AdvertiseCN.less';

const version = 'v2';
const bannerPath = `${consts.ResourcePath}/sys/aminer/banner/${version}`;

// const products = [
//   {
//     title: 'EDM期刊论文推广',
//     desc: '1.3亿全球领域专家，人工智能精准匹配',

//   },
//   {
//     title: '科研转化对接',
//     desc: '3.8亿成果信息，对接转化需求',

//   },
//   {
//     title: '科研人才引进',
//     desc: '全领域高端科研人才精确匹配',

//   },
//   {
//     title: '企业科研画像',
//     desc: '全面智能企业科研能力分析',

//   }
// ]
const AdvertiseCN: React.FC<any> = () => {

  return (
    <section className={styles.container}>
      <div className="bg">
        <img src={`${bannerPath}/banner.png`} alt="" />
      </div>
      <div className="products">
        <a target="_blank" rel="noopener noreferrer" className="btn"
          href="http://product.aminer.cn/index.php/contact_us/"
        >
          立即咨询
      </a>
        {/* {products.map(product => (
        <div className="product" key={product.title}>
          <p className="title">{product.title}</p>
          <p className="desc">{product.desc}</p>
        </div>
      ))} */}
      </div>
    </section>
  )
}

export default component()(AdvertiseCN)
