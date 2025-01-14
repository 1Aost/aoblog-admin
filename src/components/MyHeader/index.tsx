import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, message } from 'antd';
interface AdminType {
  admin_password: string
  admin_type: string
  admin_username: string
  avatar: string
  id: number
}
const MyHeader = (props: { admin: AdminType }) => {
  const { admin } = props;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("login_time");
    message.success("成功退出");
    navigate("/login");
  };

  const items = [
    {
      label: <NavLink to="/mine">个人中心</NavLink>,
      key: '0',
    },
    {
      label: <span onClick={handleLogout}>退出登录</span>,
      key: '1',
    }
  ];

  return (
    <div style={{ width: 100, marginLeft: "auto" }}>
      <Dropdown menu={{ items }}>
        <div style={{ marginRight: 15 }}>
          <span style={{ marginRight: "10px", color: "#666" }}>{admin.admin_username}</span>
          <Avatar src={<img src={admin.avatar} alt="avatar" />} />
        </div>
      </Dropdown>
    </div>
  )
}
export default MyHeader;