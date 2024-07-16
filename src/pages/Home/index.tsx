import React, { useEffect, useState } from 'react'
import { Map } from "react-amap"
import { Col, Row, message, theme } from 'antd'
import { getAllArticles } from '@/services/Articles';
import { getAdminByToken } from '@/services/Admins';
import { useNavigate } from 'react-router-dom';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Line,
  LineChart
} from "recharts";
// 引入相关Hooks
// import { useSelector, useDispatch } from 'react-redux';
import "./index.css"

interface AdminType {
  admin_password: string
  admin_type: string
  admin_username: string
  avatar: string
  id: number
}

const Home = () => {
  const time = localStorage.getItem("login_time");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [reviewData, setReviewData] = useState([]);
  const [articleData, setArticleData] = useState([]);
  const [admin, setAdmin] = useState<any>({});
  const navigate = useNavigate();

  const fetchAllArticles = () => {
    getAllArticles().then(res => {
      const articleData = res.data.map(item => ({
        name: item.article_title,
        article_likes: item.article_likes,
        article_views: item.article_views
      }));
      const reviewData = res.data.map(item => ({
        name: item.article_title,
        value: item.comments_length,
      }));
      setReviewData(reviewData);
      setArticleData(articleData);
    }).catch(_err => {
      message.error("出错了，请稍后重试");
    });
  }

  // 根据token获取用户信息
  useEffect(() => {
    getAdminByToken({ admin_token: localStorage.getItem("admin_token") }).then(res => {
      if (res.code === 401) {
        navigate('/login');
      } else {
        setAdmin((res.data as Array<AdminType>)[0]);
        fetchAllArticles();
      }
    }).catch(_err => {
      message.error("出错了，请稍后重试");
    });
  }, []);

  const plugins: any = [
    'MapType',
    'Scale',
    'OverView',
    'ControlBar', // v1.1.0 新增
    {
      name: 'ToolBar',
      options: {
        visible: true,  // 不设置该属性默认就是 true
      },
    }
  ];

  return (
    <div
      style={{
        padding: 24,
        minHeight: 624,
        background: colorBgContainer,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col className='homeLeft' span={12}>
          <div className="userInfo">
            <div className="avatar">
              <img src={admin.avatar} alt="用户" />
            </div>
            <div className="info">
              <p className="name">{admin.admin_username}</p>
              <p className="access">{admin.admin_type}</p>
            </div>
          </div>
          <div className="loginInfo">
            <div>登录时间<span>{time}</span></div>
            <div style={{ width: '100%', height: '400px' }}>登录地点
              <Map plugins={plugins} />
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div>
            <h3 style={{ marginBottom: 5 }}>博客访问量以及点赞量</h3>
            <LineChart width={600} height={250} data={articleData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="article_likes" stroke="#8884d8" />
              <Line type="monotone" dataKey="article_views" stroke="#82ca9d" />
            </LineChart>
          </div>
          <div style={{ height: "300px" }}>
            <h3 style={{ marginBottom: 5 }}>博客评论情况</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={400}>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  )
}
export default Home;


