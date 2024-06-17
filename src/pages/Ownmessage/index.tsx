import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Modal, Tag, Upload } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import layout from 'antd/es/layout';
import "./index.css"
import { changeAdmin, getAdminByToken } from '@/services/Admins';
import { uploadAvatar } from '@/services/Upload';
interface AdminType {
  admin_password: string
  admin_type: string
  admin_username: string
  avatar: string
  id: number
};

const Ownmessage: React.FC = () => {
  const [admin, setAdmin] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  // Modal对话框
  const showModal = (): void => {
    form.resetFields();
    setOpen(true);
  };
  const handleCancel = (): void => {
    setOpen(false);
  };
  // 表单的重置
  const onReset = (): void => {
    form.resetFields();
  };
  /**
   *  上传图片
   */
  // 图片地址
  const [imageUrl, setImageUrl] = useState<string>();
  // 加载
  const [loading, setLoading] = useState(false);
  // 上传前
  const beforeUpload = (file: { type: string; size: number; }) => {
    // 图片格式
    const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/JPEG/PNG/WEBP file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  // 转为base64
  const getBase64 = (img: Blob, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  // 上传图片
  const handleChangeimg = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };
  // 自定义上传函数
  const customUpload = ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    uploadAvatar(formData).then((res: any) => {
      setImageUrl("./avatar/" + res.url);
    })
  };

  const fetchData = () => {
    // 根据token获取用户信息
    getAdminByToken({ admin_token: localStorage.getItem("admin_token") }).then(res => {
      setAdmin((res.data as Array<AdminType>)[0]);
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = (values: any) => {
    changeAdmin({
      id: admin.id,
      ...values,
      avatar: imageUrl,
      admin_type: admin.admin_type
    }).then(res => {
      message.success(res.msg);
      setOpen(false);
      fetchData();
    })
  };

  return (
    <div className="bbb">
      <h3>个人信息展示</h3>
      <div className="img">
        <span>头像：</span><img src={admin.avatar} alt="用户" />
      </div>
      <div className="info">
        <div className="status">
          <span>身份：</span><Tag color={admin.admin_type === '超级管理员' ? "cyan" : "purple"}>{admin.admin_type}</Tag>
        </div>
        <div className="name">
          <span>用户名：</span><p>{admin.admin_username}</p>
        </div>
        <div className="password">
          <span>密码：</span><p>{admin.admin_password}</p>
        </div>
      </div>
      <Button onClick={() => showModal()} icon={<EditOutlined />}>Edit</Button>
      <Modal
        title="修改个人信息"
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
        // autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="admin_username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="admin_password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Avatar" style={{ marginLeft: "25px" }}>
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChangeimg}
              customRequest={({ file }) => customUpload({ file })}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%', marginTop: '10px' }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={onReset} style={{ marginLeft: "10px" }}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Ownmessage;