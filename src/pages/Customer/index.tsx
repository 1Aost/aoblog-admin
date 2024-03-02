import React, { useEffect, useState } from 'react'
import { Form, Input, Upload } from 'antd';

import { Space,Button, Modal, Table, message } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import "./index.css"
import apiFun from '../../api';
interface DataType {
    key:string,
    id: number;
    username: string;
}
const Customer:React.FC=()=>{
    const columns: ColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (_, record:any) => (
                <div>
                    <img style={{width:"200px"}} src={record.avatar} alt="" />
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                {/* <a>修改</a> */}
                <a onClick={handleDelete(record)}>删除</a>
            </Space>
            ),
        },
    ];
    const [form]=Form.useForm();
    const [data,setData]=useState<DataType[]>([]);

    const [open, setOpen] = useState(false);

    const showModal = () => {
        form.resetFields();
        setOpen(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    useEffect(()=>{
        fetchData();
    },[]);

    // 获取数据的函数
    function fetchData() {
        apiFun.getAllUsers().then((res) => {
            // console.log(res);
            const newData = res.data.map((item, index) => ({
                ...item,
                key: (index + 1).toString(),
            }));
            setData(newData);
        });
    }
    // 删除
    function handleDelete(record:any) {
        return ()=>{
            console.log(record);
            apiFun.deleteUser({id:record.id}).then((res)=>{
                console.log(res);
                if(res.code==='6001') {
                    message.error(res.msg);
                }else {
                    message.success(res.msg);
                    // 删除成功后重新获取数据
                    fetchData();
                }
            })
        }
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
    const handleChange = (info: any) => {
        console.log(info.file, 'info');
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {    
            getBase64(info.file.originFileObj, (imageUrl: any) => {
                setImageUrl(imageUrl);
                // setSubmitParams({ ...submitParams, cover: info.file.response.url });
                setLoading(false);
            });
        }
    };
    // 自定义上传函数
    const customUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        // console.log(formData);
        apiFun.uploadAvatar(formData).then((res:any)=>{
            // console.log(res.url);
            setImageUrl("./avatar/"+res.url);
        })
    };
    //  新增
    function handleAdd() {
        showModal();
    }
    const onFinish = (values: any) => {
        apiFun.addUser({...values,avatar:imageUrl}).then((res)=>{
            if(res.code==='0000') {
                message.success(res.msg);
                setOpen(false);
                fetchData();
            }else {
                message.error(res.msg);
            }
        })
        form.resetFields();
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div
            style={{
                padding: 24,
                minHeight: 624,
            }}
        >
            <Button className='btn' onClick={handleAdd} type="primary" icon={<PlusOutlined />}>
                新增
            </Button>
            <Modal
                title="新增用户"
                open={open}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="头像">
                        <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
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
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}
export default Customer;


