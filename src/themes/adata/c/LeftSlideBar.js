import { useMemo, useCallback } from 'react';
import { component, Link, withRouter } from 'acore';
import { Menu, Icon } from 'antd';

const LeftSlideBar = props => {
  const { location: { pathname, search } } = props;

  const menuItems = useMemo(() => {
    const menus = [
      { id: 100, name: '专家标注', router: `/search/person?&t=b` },
      { id: 200, name: '智库标注', router: '/ebs' },
      // { id: 300, name: '预警工具等页面', router: '/ebs' },
    ]
    return menus.map((item) => {
      return (
        <Menu.Item key={item.router}>
          <Link to={item.router}>
            {item.name}
          </Link>
        </Menu.Item>
      )
    })
  }, []);

  const selectedKey = useMemo(() => {
    return pathname && (pathname.includes('/search') || pathname.includes('/profile')) ? '/search/person?&t=b' : pathname;
  }, [pathname])

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
    >
      {menuItems}
    </Menu >
  )
}

export default component(withRouter)(LeftSlideBar)
