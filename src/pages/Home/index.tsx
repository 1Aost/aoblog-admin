import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Map } from "react-amap"
import { Col, Row, Card, theme, message } from 'antd'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
  PieChart,
  Pie
} from "recharts";
// 引入相关Hooks
// import { useSelector, useDispatch } from 'react-redux';
import "./index.css"
import { getAllArticles } from '@/services/Articles';
import { getAdminByToken } from '@/services/Admins';
interface ArticleType {
  id: number
  article_url: string
  article_img: string
  article_type: string
  article_likes: number
  article_views: number
  article_reviews: number
  article_title: string
  article_introduction: string
  article_time: string
  comments_length: number
}
interface NewArticleType {
  name: string
  article_likes: number
  article_views: number
}
interface AdminType {
  admin_password: string
  admin_type: string
  admin_username: string
  avatar: string
  id: number
}
const renderCustomizedLabel = (props: any) => {
  const { x, y, width, value } = props;
  const radius = 10;
  return (
    <g>
      <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value[0]}
      </text>
    </g>
  );
};
const Home: React.FC = () => {
  const time = localStorage.getItem("login_time");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [data01, setData01] = useState<any[]>([]);
  const [admin, setAdmin] = useState<any>({});
  const navigate = useNavigate();
  useEffect(() => {
    getAllArticles().then(res => {
      const newData = res.data.map((item: any) => ({
        name: item.article_title,
        value: item.comments_length,
      }));
      setData01(newData);
    })
  }, [])
  const [data, setData] = useState<NewArticleType[]>([]);
  useEffect(() => {
    getAllArticles().then(res => {
      const newData: NewArticleType[] = (res.data as Array<ArticleType>).map((item: ArticleType) => ({
        name: item.article_title,
        article_likes: item.article_likes,
        article_views: item.article_views
      }));
      setData(newData);
    }).catch(_err => {
      message.error("出错了，请稍后重试");
    });
  }, [])
  // 根据token获取用户信息
  useEffect(() => {
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
  ]
  return (
    <div
      style={{
        padding: 24,
        minHeight: 624,
        background: colorBgContainer,
      }}
    >
      <Row>
        {/* 右边 */}
        <Col className='righ' span={16} push={8} style={{ paddingLeft: "20px" }}>
          <Card className='box-card box1' bordered={true} hoverable={true} style={{ width: "100%" }}>
            <h3>博客访问量以及点赞量</h3>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="article_likes" fill="#8884d8" minPointSize={5}>
                <LabelList dataKey="name" content={renderCustomizedLabel} />
              </Bar>
              <Bar dataKey="article_views" fill="#82ca9d" minPointSize={10} />
            </BarChart>
            <div className='box-card box1' style={{ width: 400, height: "300px" }}>
              <h3>博客评论情况</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data01}
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
          </Card>
        </Col>
        {/* 左边 */}
        <Col span={8} pull={16}>
          <Card className='box-card box1' bordered={true} hoverable={true} style={{ width: 400 }}>
            <div className="user">
              <div className="avatar">
                <img src={admin.avatar} alt="用户" />
              </div>
              <div className="userinfo">
                <p className="name">{admin.admin_username}</p>
                <p className="access">{admin.admin_type}</p>
              </div>
            </div>
            <div className="login-info">
              <p>登录时间
                <span>{time}</span>
              </p>
              <p>登录地点
                <div style={{ width: '100%', height: '400px' }}>
                  <Map plugins={plugins} />
                </div>
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default Home;


