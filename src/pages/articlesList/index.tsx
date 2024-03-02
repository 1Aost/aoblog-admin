import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Upload } from 'antd';
import { Space, Button, Modal, Table, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import type { ColumnsType } from 'antd/es/table';
import apiFun from '../../api';
import {timestampToTime} from "../../api/utils"

interface DataType {
    key:string,
    id: number;
    article_url: string;
    article_img: string;
    article_type: string;
    article_likes: number;
    article_views: number;
    article_reviews: number;
    article_title: string;
    article_introduction: string;
    article_time: string;
}
const { Option } = Select;
const {TextArea} =Input;
const ArticlesList:React.FC=()=>{
    const [form]=Form.useForm();
    const [data,setData]=useState<DataType[]>([]);
    const [open, setOpen] = useState(false);
    const [ids, setIds] = useState(0);
    const [type,setType]=useState<any[]>([]);
    const [subtype,setSubtype]=useState<any>('');
    const columns: ColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '文章路径',
            dataIndex: 'article_url',
            key: 'article_url',
        },
        {
            title: '文章封面照片',
            dataIndex: 'article_img',
            key: 'article_img',
            render: (_, record:any) => (
                <div>
                    <img style={{width:"100%"}} src={record.article_img} alt="" />
                </div>
            ),
        },
        {
          title: '文章类型',
          dataIndex: 'article_type',
          key: 'article_type',
        },
        {
            title: '文章点赞数量',
            dataIndex: 'article_likes',
            key: 'article_likes',
        },
        {
            title: '文章访问人数',
            dataIndex: 'article_views',
            key: 'article_views',
        },
        {
          title: '文章留言人数',
          dataIndex: 'article_reviews',
          key: 'article_reviews',
        },
        {
          title: '文章标题',
          dataIndex: 'article_title',
          key: 'article_title',
        },
        {
          title: '文章简介',
          dataIndex: 'article_introduction',
          key: 'article_introduction',
        },
        {
          title: '文章发布时间',
          dataIndex: 'article_time',
          key: 'article_time',
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={handleChange(record)}>修改</a>
                    <a onClick={handleDelete(record)}>删除</a>
                </Space>
            ),
        },
    ];
    // 修改中type的选择
    const onTypeChange = (value: string) => {
        setSubtype(value);
    };
    // Modal对话框的展示
    const showModal = () => {
        form.resetFields();
        setOpen(true);
    };
    // 关闭对话框
    const handleCancel = () => {
        setOpen(false);
    };
    useEffect(()=>{
        fetchData();
        let typeData:any[]=[];
        // 获取所有的类型
        apiFun.getAllTypes().then((res:any)=>{
            if(res.code==="0000") {
                res.data.map((item:any)=>{
                    return typeData.push(item.type);
                })
            }
        })
        setType(typeData);
    },[]);
    // 获取数据的函数
    function fetchData() {
        apiFun.getAllArticles().then((res:any) => {
            const newData = res.data.map((item, index) => ({
                ...item,
                review_time:timestampToTime(item.review_time,true),
                article_time:timestampToTime(item.article_time,true),
                key: (index + 1).toString(),
            }));
            setData(newData);
        });
    }
    // 删除
    function handleDelete(record:any) {
        return ()=>{
            apiFun.deleteArticle({id:record.id}).then((res:any)=>{
                if(res.code==='0000') {
                    message.success(res.msg);
                    // 删除成功后重新获取数据
                    fetchData();
                }else {
                    message.error(res.msg);
                }
            })
        }
    }
    // 修改
    function handleChange(record:any) {
        return ()=>{
            showModal();
            setIds(record.id);
            form.setFieldsValue(record); // 设置表单的值
        }
    }
    // 修改的函数
    const onFinish = (values: any) => {
        apiFun.changeArticle({id:ids,...values,article_img:imageUrl}).then((res:any)=>{
            if(res.code==='0000') {
                message.success(res.msg);
                setOpen(false);
                fetchData();
                form.resetFields();
            }else {
                message.error(res.msg);
            }
        })
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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
        console.log(info.file, 'info');
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
        apiFun.uploadImagwe(formData).then((res:any)=>{
            setImageUrl("./images/"+res.url);
        })
    };
    return (
        <div
            style={{
                padding: 24,
                minHeight: 624,
            }}
        >
            <Modal
                title="修改文章信息"
                open={open}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item name="article_type" label="文章类型" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select a type"
                            onChange={onTypeChange}
                            allowClear
                        >
                            {
                                type.map((item)=>{
                                    return (
                                        <Option key={item} value={item}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="文章标题"
                        name="article_title"
                        rules={[{ required: true, message: 'article_title is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="文章简介"
                        name="article_introduction"
                        rules={[{ required: true, message: 'article_introduction is required' }]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item label="文章封面照片" rules={[{required: true}]} >
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
                    </Form.Item>
                </Form>
            </Modal>
            <Table style={{width:"100%"}} columns={columns} dataSource={data} scroll={{ x: 1500 }} />
        </div>
    )
}
export default ArticlesList;


