import { timestampToTime } from "@/api/utils";
import { login } from "@/services/Admins";
import { Button, Form, Input, message, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const [form] = Form.useForm();
  const navigateTo = useNavigate();

  const onFinish = (values: { username: string, password: string }) => {
    login(values).then(res => {
      localStorage.setItem("admin_token", res.data as string);
      message.success(res.msg);
      localStorage.setItem("login_time", timestampToTime(Date.now(), true));
      navigateTo("/home");
    })
  };

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '用户名不能为空！',
            },
            {
              max: 10,
              message: '用户名不得超过10个字符'
            }
          ]}
        >
          <Input variant="filled" style={{ height: "53px" }} placeholder={"请输入用户名"} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '密码不能为空！',
            },
            {
              max: 19,
              message: '密码长度不得少于19个字符',
            }
          ]}
        >
          <Input.Password
            variant="filled"
            style={{
              height: "53px",
            }}
            placeholder={"请输入密码"}
          />
        </Form.Item>
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Typography.Link
            style={{
              textAlign: "right",
            }}
          >
            Forgot password?
          </Typography.Link>
        </div>
        <Form.Item
          style={{
            marginTop: "30px",
          }}
          wrapperCol={{ span: 24 }}
        >
          <Button style={{ height: "48px", width: "100%" }} type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default LoginForm;