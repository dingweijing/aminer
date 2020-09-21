/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useMemo, useState } from 'react';
import consts from 'consts';

// * ----------------------------------------------------------------------
// * usePrevious
// * https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
// * ----------------------------------------------------------------------
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// * ----------------------------------------------------------------------
// * useSSRTwoPassRender
// *
// * ----------------------------------------------------------------------
// SSR 我可以只在更新时运行 effect. elvoa @ 2019-09-25

// * SSR渲染，客户端第一次渲染，或者condition为false时走默认渲染。
const useSSRTwoPassRender = (props, monitor) => {
  const { render, defaultRender = () => false, failedRender, test: condition } = props;

  // 这个if不用考虑优化，因为只在服务端执行一次就不再有了。因此也绝不会触发react-hooks/rules-of-hooks的警告。
  // * Return 1: 服务端直接走默认。
  if (consts.IsServerRender()) {
    return defaultRender && defaultRender();
  }

  const firstRender = useRef(true);
  const [refresh, setRefresh] = useState(0); // 强制刷新使用

  // * Return 3: 第一次渲染处理
  let isFirstRender = false;
  let firstRenderBlock;
  if (firstRender.current) {
    isFirstRender = true;
    firstRenderBlock = defaultRender && defaultRender();
  }

  // * Return 2: 测试条件没通过，走默认。 // ! ？？？ 确定要这样？
  const hasTest = typeof condition === 'function' || typeof condition === 'boolean';
  const testPassed = hasTest && (typeof condition === 'boolean' ? condition : condition(monitor));

  // * 设置flag
  useEffect(() => {
    firstRender.current = false;
    setRefresh(refresh + 1); // 这里在第一次渲染的时候强制触发下一次刷新。做一个延时加载的样子。
  }, []);

  const monitors = monitor && [...monitor, isFirstRender, refresh, hasTest, testPassed];

  const result = useMemo(() => {
    if (isFirstRender) {
      return firstRenderBlock;
    }

    // * 未通过测试
    if (hasTest && !testPassed) {
      if (failedRender) {
        return failedRender();
      }
      return firstRenderBlock || false;
    }
    // * 正常调用render
    const params = { hasTest, testPassed };
    return render && render(params);
  }, monitors);

  return result;
};

// * ----------------------------------------------------------------------
// * useResizeEffect
// *
// * ----------------------------------------------------------------------

function useResizeEffect(menuRef) {
  useEffect(() => {
    const showMenu = () => {
      const { clientWidth } = (document && document.body) || {};
      if (!menuRef.current) {
        return;
      }
      if (clientWidth > 768) {
        menuRef.current.style.display = 'block';
      } else {
        menuRef.current.style.display = 'none';
      }
    };
    window.addEventListener('resize', showMenu);

    return () => {
      window.removeEventListener('resize', showMenu);
    };
  }, []);
  return menuRef;
}

function useResizeEffect_NEW(menuRef, { width = 768, reverse = false, monitors = [] }) {
  const showMenu = () => {
    const { clientWidth } = (document && document.body) || {};
    if (!menuRef.current) {
      return;
    }
    if ((clientWidth > width && !reverse) || (clientWidth <= width && reverse)) {
      menuRef.current.style.display = 'block';
    } else {
      menuRef.current.style.display = 'none';
    }
  };
  useEffect(() => {
    showMenu();
  });
  useEffect(() => {
    showMenu();
    window.addEventListener('resize', showMenu);

    return () => {
      window.removeEventListener('resize', showMenu);
    };
  }, []);
  return menuRef;
}

export { usePrevious, useSSRTwoPassRender, useResizeEffect, useResizeEffect_NEW };
