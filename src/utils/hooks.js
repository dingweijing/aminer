import { useEffect } from 'react';

const isIE = () => {
  // 取得浏览器的userAgent字符串
  if (navigator) {
    const { userAgent } = navigator;
    return userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  }
};

const useImageLazyLoad = () => {
  useEffect(() => {
    const imageToLazy = document.querySelectorAll('img[data-src]');
    const loadImage = image => {
      image.setAttribute('src', image.getAttribute('data-src'));
      image.addEventListener('load', () => {
        // image.removeAttribute('data-src');
      });
    };

    if (isIE()) {
      imageToLazy.forEach(image => {
        image.setAttribute('src', image.getAttribute('data-src'));
        image.addEventListener('load', () => {
          image.removeAttribute('data-src');
        });
      });
      return;
    }

    if (!window.IntersectionObserver) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      (items, observer) => {
        items.forEach(item => {
          if (item.isIntersecting) {
            loadImage(item.target);
            observer.unobserve(item.target);
          }
        });
      },
      { rootMargin: '100% 0px 100% 0px' },
    );

    imageToLazy.forEach(image => {
      intersectionObserver.observe(image);
    });
  });
};

const highlight = (string, words = []) => {
  if (!words.length) {
    return string;
  }
  const reg = new RegExp(words.join('|'), 'ig');
  return string.replace(reg, '<mark class="highlight">$&</mark>');
};

const useGetFollowsByID = (dispatch, withFollow, entities) => {
  useEffect(() => {
    if (withFollow && entities) {
      const ids = entities?.map(item => item && item.id).filter(item => item && !item.id);
      dispatch({
        type: 'collection/IsFollow',
        payload: {
          ids,
        },
      });
    }
  }, [entities]);
};

const useGetCategoriesByID = (dispatch, withCategory, entities) => {
  useEffect(() => {
    if (withCategory && entities) {
      const ids = entities?.map(item => item && item.id).filter(item => item && !item.id);
      dispatch({
        type: 'collection/GetCategoryByFollowIDs',
        payload: {
          ids,
        },
      });
    }
  }, [entities]);
};

const useGetPubCollections = (dispatch, withFollow) => {
  useEffect(() => {
    if (withFollow) {
      dispatch({
        type: 'collection/ListCategory',
        payload: {
          includes: ['p'],
        },
      });
    }
  }, []);
};

export {
  useImageLazyLoad,
  highlight,
  useGetFollowsByID,
  useGetPubCollections,
  useGetCategoriesByID,
};
