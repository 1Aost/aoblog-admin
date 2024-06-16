import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown, Space, Avatar, message } from 'antd';
import "./index.css"
import { getAdminByToken } from '@/services/Admins';

interface AdminType {
  admin_password: string
  admin_type: string
  admin_username: string
  avatar: string
  id: number
}
const MyHeader: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminType>({
    admin_password: "",
    admin_type: "",
    admin_username: "",
    avatar: "",
    id: 0
  });
  useEffect(() => {
    // 根据token获取用户信息
    getAdminByToken({ admin_token: localStorage.getItem("admin_token") }).then(res => {
      if (res.code === '0000') {
        setAdmin((res.data as Array<AdminType>)[0]);
      } else if (res.code === '1111') {
        message.error(res.msg);
        navigate("/login")
      } else {
        message.error(res.msg);
      }
    }).catch(_err => {
      message.error("出错了，请稍后重试");
    })
  }, []);
  function handleLogout(): void {
    message.success("成功退出");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("login_time");
    navigate("/login");
  }
  const items = [
    {
      label: <NavLink to="/main/mine">个人中心</NavLink>,
      key: '0',
    },
    {
      label: <span onClick={handleLogout}>退出登录</span>,
      key: '1',
    }
  ];
  return (
    <Dropdown
      className='drop'
      menu={{
        items,
      }}
      trigger={['click']}
    >
      <a href="###" onClick={(e) => e.preventDefault()}>
        <span style={{ marginRight: "10px", color: "#666" }}>{admin.admin_username}</span>
        <Space>
          <Avatar src={<img src={admin.avatar} alt="avatar" />} />
        </Space>
      </a>
    </Dropdown>
  )
}
export default MyHeader;