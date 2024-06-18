import React, { useEffect, useState } from 'react'
import { Breadcrumb, Layout, Menu, message, theme } from 'antd';
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";

import {
  DeploymentUnitOutlined,
  HomeOutlined,
  TeamOutlined,
  MessageOutlined,
  SnippetsOutlined,
  FileOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import MyHeader from '@/components/MyHeader';
type MenuItem = Required<MenuProps>['items'][number];

const breadcrumbNameMap: Record<string, string> = {
  '/': "System",
  '/home': 'Home',
  '/users/customer': 'Customer',
  '/users/manager': 'Manager',
  '/notes': 'Note',
  '/articles/articlesList': 'ArticlesList',
  '/articles/newArticles': 'NewArticles',
  '/articles/ArticlesType': 'ArticlesType',
  '/articles/ArticlesLike': 'Likes',
  '/reviews': 'Reviews',
  '/mine': 'Mine',
};
const { Header, Sider, Content } = Layout;

const Main: React.FC = () => {
  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      message.warning("尚未登录");
      navigateTo("/login");
    }
  }, []);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigateTo = useNavigate();
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const url = `/${pathSnippets.slice(0, 2).join('/')}`;

  const extraBreadcrumbItems = {
    key: url,
    title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
  };
  const breadcrumbItems = [
    {
      title: <HomeOutlined />,
      key: 'Main',
    },
  ].concat(extraBreadcrumbItems);

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  const menuItems = [
    getItem('首页', '/home', <HomeOutlined />),
    getItem('用户管理', 'Users', <TeamOutlined />, [
      getItem("顾客管理", "/users/customer"),
      getItem("管理员管理", "/users/manager")
    ]),
    getItem('留言', '/notes', <MessageOutlined />),
    getItem('文章', 'Articles', <SnippetsOutlined />, [
      getItem('文章列表', '/articles/articlesList'),
      getItem('文章创作', '/articles/newArticles'),
      getItem('文章类别', '/articles/ArticlesType'),
      getItem('文章点赞', '/articles/ArticlesLike'),
    ]),
    getItem('文章留言', '/reviews', <FileOutlined />),
    getItem('个人中心', '/mine', <UserOutlined />),
  ];

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            color: "#fff",
            textAlign: "center",
          }}
        >{collapsed ? <DeploymentUnitOutlined /> : 'Aoblog System'}</div>
        <Menu onClick={(e) => navigateTo(e.key)} theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <MyHeader />
        </Header>
        <Content style={{ margin: '5px 16px', overflow: 'initial' }}>
          <Breadcrumb items={breadcrumbItems} />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet></Outlet>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
export default Main;
