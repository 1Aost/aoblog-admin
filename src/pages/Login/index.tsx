import React, { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import { Button, Form, Input,Card, message } from 'antd';
import {tsParticles} from "tsparticles"
import apiFun from '../../api';
import { timestampToTime } from '../../api/utils';
import "./index.css"
interface MessageType {
  code: string // 返回的状态码
  msg: string // 提示信息
  data: string | null // 携带的token
}
const Login: React.FC = () => {
  const navigateTo=useNavigate();
  const onFinish = (values: {username: string,password: string}) => {
    apiFun.login(values).then((res: MessageType)=>{
      if(res.code==='0000') {
        localStorage.setItem("admin_token",res.data as string);
        message.success(res.msg);
        localStorage.setItem("login_time",timestampToTime(Date.now(),true));
        navigateTo("/main/home");
      }else if(res.code==='5000') {
        message.error(res.msg)
      }else if(res.code==='5001') {
        message.warning(res.msg)
      }
    })
  };
  const onFinishFailed = (errorInfo:any): void => {
    console.log('Failed:', errorInfo);
    alert("登录失败，请稍后再试");
  };
  useEffect(() => {
    const particlesContainer: HTMLDivElement = document.createElement("div");
    particlesContainer.id = "particles-container";
    document.body.appendChild(particlesContainer);
    // 背景
    tsParticles.load("tsparticles", {
      fps_limit: 60,
      interactivity: {
        detect_on: "canvas",
        events: {
          onclick: { enable: true, mode: "push" },
          onhover: {
            enable: true,
            mode: "attract",
            parallax: { enable: false, force: 60, smooth: 10 }
          },
          resize: true
        },
        modes: {
          push: { quantity: 4 },
          attract: { distance: 200, duration: 0.4, factor: 5 }
        }
      },
      particles: {
        color: { value: "#ffffff" },
        line_linked: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1
        },
        move: {
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
          bounce: false,
          direction: "none",
          enable: true,
          out_mode: "out",
          random: false,
          speed: 2,
          straight: false
        },
        number: { density: { enable: true, value_area: 800 }, value: 80 },
        opacity: {
          anim: { enable: false, opacity_min: 0.1, speed: 1, sync: false },
          random: false,
          value: 0.5
        },
        shape: {
          character: {
            fill: false,
            font: "Verdana",
            style: "",
            value: "*",
            weight: "400"
          },
          image: {
            height: 100,
            replace_color: true,
            src: "images/github.svg",
            width: 100
          },
          polygon: { nb_sides: 5 },
          stroke: { color: "#000000", width: 0 },
          type: "circle"
        },
        size: {
          anim: { enable: false, size_min: 0.1, speed: 40, sync: false },
          random: true,
          value: 5
        }
      },
      polygon: {
        draw: { enable: false, lineColor: "#ffffff", lineWidth: 0.5 },
        move: { radius: 10 },
        scale: 1,
        type: "none",
        url: ""
      },
      retina_detect: true
    });
  }, []);
  return (
    <div className='box'>
      <div id="tsparticles"></div>
      <Card
        title="Login Here"
        className='card1'
        style={{
          width: 400,
        }}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
            >
              <Input className='input' />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            >
            <Input.Password className='input' />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            >
            <Button className='btn' type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default Login;