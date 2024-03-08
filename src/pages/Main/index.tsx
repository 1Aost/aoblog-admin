import React, { useEffect } from 'react'
import { Breadcrumb, Layout, message, theme } from 'antd';
import { useNavigate,Outlet, Link, useLocation } from "react-router-dom"
import MyHeader from "@/components/MyHeader"
import MySlider from "@/components/MySlider"
const { Header, Content } = Layout;
const breadcrumbNameMap: Record<string, string> = {
    '/main/home':'Home',
    '/main/customer':'Customer',
    '/main/manager':'Manager',
    '/main/note':'Note',
    '/main/articlesList':'ArticlesList',
    '/main/newArticles':'NewArticles',
    '/main/ArticlesType':'ArticlesType',
    '/main/reviews':'Reviews',
    '/main/mine':'Mine',
    '/main/ArticlesLike':'Likes',
};

const Main:React.FC=()=>{
    useEffect(() => {
        if(!localStorage.getItem("admin_token")) {
            message.warning("尚未登录");
            navigateTo("/login");
        }
    })
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigateTo=useNavigate();
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const url = `/${pathSnippets.slice(0,  2).join('/')}`;
    
    
    const extraBreadcrumbItems =  {
        key: url,
        title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
    };
    const breadcrumbItems = [
        {
          title: <Link to="/">Main</Link>,
          key: 'Main',
        },
    ].concat(extraBreadcrumbItems);
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            {/* 左侧侧边栏 */}
            <MySlider></MySlider>
            {/* 右侧 */}
            <Layout className="site-layout">
                {/* 右侧头部 */}
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <MyHeader></MyHeader>
                </Header>
                {/* 右侧内容区 */}
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    {/* 面包屑 */}
                    <Breadcrumb items={breadcrumbItems} />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 624,
                            background: colorBgContainer,
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