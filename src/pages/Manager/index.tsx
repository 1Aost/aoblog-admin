import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Tag, Upload } from 'antd';

import { Space, Button, Modal, Table, message } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import "./index.css";
import ActionRender from '@/components-antd/Display/ActionRender';
import HeaderGroup from '@/components-antd/Header/HeaderGroup';
import { addAdmin, changeAdmin, deleteAdmin, getAdminByToken, getAllAdmins } from '@/services/Admins';
import { uploadAvatar } from '@/services/Upload';
interface AdminType {
  admin_password: string
  admin_type: string
  admin_username: string
  avatar: string
  id: number
}
interface DataType {
  key: string
  id: number
  admin_username: string
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;
const Manager: React.FC = () => {
  const [form] = Form.useForm();
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'admin_username',
      key: 'admin_username',
    },
    {
      title: 'Status',
      dataIndex: 'admin_type',
      key: 'admin_type',
      render: (_, record: any) => (
        <Space size={[0, 8]} wrap>
          <Tag color={record.admin_type === '超级管理员' ? "cyan" : "purple"}>{record.admin_type}</Tag>
        </Space>
      )
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_, record: any) => (
        <div>
          <img style={{ width: "200px" }} src={record.avatar} alt="" />
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        status === '超级管理员' ?
          <ActionRender
            onEdit={() => handleChange(record)}
            onDelete={() => handleDelete(record)}
          />
          :
          <ActionRender
            extra={<Tag color="gold">不具备权限</Tag>}
          />
      ),
    },
  ];
  const [data, setData] = useState<DataType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  // 区分新增和修改的情况  1为新增 2为修改
  const [type, setType] = useState<number>(0);
  // 为修改的情况
  const [ids, setIds] = useState<number>(0);
  const [_subtype, setSubtype] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const showModal = (): void => {
    form.resetFields();
    setOpen(true);
  };
  const handleCancel = (): void => {
    setOpen(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据的函数
  function fetchData() {
    getAllAdmins().then(res => {
      const newData = (res.data as Array<AdminType>).map((item, index) => ({
        ...item,
        key: (index + 1).toString(),
      }));
      setData(newData);
    });
  }
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
    uploadAvatar(formData).then(res => {
      setImageUrl("./avatar/" + res.url);
    })
  };
  //  新增
  const handleAdd = () => {
    setType(1);
    showModal();
  }
  // 删除
  const handleDelete = (record: DataType) => {
    deleteAdmin({ id: record.id }).then(res => {
      message.success(res.msg);
      // 删除成功后重新获取数据
      fetchData();
    })
  }
  // 修改中type的选择
  const onTypeChange = (value: string): void => {
    setSubtype(value);
  };
  // 新增和修改的回调函数
  const onFinish = (values: { admin_password: string, admin_type: string, admin_username: string }) => {
    const req = type === 1 ? addAdmin({ ...values, avatar: imageUrl }) : changeAdmin({ id: ids, ...values, avatar: imageUrl });
    req.then(res => {
      message.success(res.msg);
      setOpen(false);
      fetchData();
      form.resetFields();
    })
  };

  // 修改
  const handleChange = (record: DataType) => {
    setType(2);
    showModal();
    setIds(record.id);
    form.setFieldsValue(record);
  }
  // 表单的重置
  const onReset = (): void => {
    form.resetFields();
  };
  useEffect(() => {
    // 根据token获取用户信息
    getAdminByToken({ admin_token: localStorage.getItem("admin_token") }).then(res => {
      setStatus((res.data as Array<AdminType>)[0].admin_type);
    })
  }, []);

  return (
    <div
      style={{
        padding: 24,
        minHeight: 624,
      }}
    >
      {
        status === '超级管理员' ?
          (
            <div>
              <HeaderGroup>
                <Button className='btn' onClick={handleAdd} type="primary" icon={<PlusOutlined />}>
                  新增
                </Button>
              </HeaderGroup>
              <Modal
                title={type === 1 ? "新增管理员" : "修改管理员"}
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
                  <Form.Item name="admin_type" label="身份" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select a type"
                      onChange={onTypeChange}
                      allowClear
                    >
                      <Option value='超级管理员'>超级管理员</Option>
                      <Option value='管理员'>管理员</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="头像">
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
          ) : null
      }
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
export default Manager;


