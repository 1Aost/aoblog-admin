import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message, Modal, Tag, Upload } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import layout from 'antd/es/layout';
import apiFun from '../../api';
import "./index.css"
interface MessageType {
  code: string
  msg:string
  data: null | Array<AdminType>
}
interface AdminType {
  admin_password: string
  admin_type: string
  admin_username: string
  avatar: string
  id: number
}
const Ownmessage:React.FC=()=>{
  const [admin,setAdmin]=useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const navigate=useNavigate();
  const [form]=Form.useForm();
  // Modal对话框
  const showModal = (): void => {
    form.resetFields();
    setOpen(true);
  };
  const handleCancel = (): void => {
    console.log('Clicked cancel button');
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
  const customUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    apiFun.uploadAvatar(formData).then((res:any)=>{
      setImageUrl("./avatar/"+res.url);
    })
  };
  function fetchData(): void {
    // 根据token获取用户信息
    let admin_token=localStorage.getItem("admin_token")
    apiFun.getAdminByToken({admin_token}).then((res: MessageType)=>{
      if(res.code==='0000') {
        setAdmin((res.data as Array<AdminType>)[0]);
      }else if(res.code==='1111') {
        message.error(res.msg);
        navigate("/login");
      }else {
        message.error(res.msg);
      }
    })
  }
  useEffect(()=>{
    fetchData();
  },[]);
  const onFinish = (values: any): void => {
    apiFun.changeAdmin({id:admin.id,...values,avatar:imageUrl,admin_type:admin.admin_type}).then((res:any)=>{
      if(res.code==='0000') {
        message.success(res.msg);
        setOpen(false);
        fetchData();
      }else {
        message.error(res.msg);
      }
    })
  };
  const onFinishFailed = (errorInfo: any): void => {
    console.log('Failed:', errorInfo);
  };
  function handleChange(): void {
    showModal();
  }
  return (
    <div className="bbb">
      <h3>个人信息展示</h3>
      <div className="img">
        <span>头像：</span><img src={admin.avatar} alt="用户" />
      </div>
      <div className="info">
        <div className="status">
          <span>身份：</span><Tag color={admin.admin_type==='超级管理员'?"cyan":"purple"}>{admin.admin_type}</Tag>
        </div>
        <div className="name">
          <span>用户名：</span><p>{admin.admin_username}</p>
        </div>
        <div className="password">
          <span>密码：</span><p>{admin.admin_password}</p>
        </div>
      </div>
      <Button onClick={handleChange} icon={<EditOutlined />}>Edit</Button>
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
            onFinishFailed={onFinishFailed}
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
            <Form.Item label="Avatar" style={{marginLeft:"25px"}}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChangeimg}
                customRequest={({ file, onSuccess, onError }) => customUpload({ file, onSuccess, onError })}
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
              <Button htmlType="button" onClick={onReset} style={{marginLeft:"10px"}}>
                重置
              </Button>
            </Form.Item>
        </Form>
    </Modal>
    </div>
  )
}
export default Ownmessage;