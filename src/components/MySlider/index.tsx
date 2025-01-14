import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Layout, Menu } from 'antd';
import { 
    HomeOutlined, 
    TeamOutlined,
    MessageOutlined,
    SnippetsOutlined,
    FileOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
function getItem(label:any, key:any, icon:any, children:any) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('首页', '/main/home', <HomeOutlined />,null),
    getItem('用户管理', '/main', <TeamOutlined />,[
        getItem("顾客管理","customer", null,null),
        getItem("管理员管理","manager", null,null)
    ]),
    getItem('留言', '/main/note', <MessageOutlined />,null),
    getItem('文章', '/home', <SnippetsOutlined />, [
        getItem('文章列表', 'articlesList', null,null),
        getItem('文章创作', 'newArticles', null,null),
        getItem('文章类别', 'ArticlesType', null,null),
        getItem('文章点赞', 'ArticlesLike', null,null),
    ]),
    getItem('文章留言', '/main/reviews', <FileOutlined />,null),
    getItem('个人中心', '/main/mine', <UserOutlined />,null),
];
const Main:React.FC=()=>{
    const [collapsed, setCollapsed] = useState(false);
    const navigateTo=useNavigate();
    const menuClick=(e:any)=>{
        navigateTo(e.key);
    }
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div
                style={{
                    height: 32,
                    margin: 16,
                    color:"#fff",
                    textAlign:"center",
                }}
            >管理系统</div>
            <Menu onClick={menuClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
    );
}
export default Main;