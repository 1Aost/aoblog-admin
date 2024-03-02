import React, { useEffect, useState } from 'react'
import { Form, Input } from 'antd';
import { Space, Button, Modal, Table, message } from 'antd'
import { PlusOutlined } from "@ant-design/icons"
import type { ColumnsType } from 'antd/es/table';
import apiFun from '../../api';

interface DataType {
    id: number;
    type: string
}
const ArticlesType:React.FC=()=>{
    const [form]=Form.useForm();
    const [open, setOpen] = useState(false);
    const [ids, setIds] = useState(0);
    const [type,setType]=useState<any[]>([]);
    const [subtype,setSubType]=useState<any>(0);
    const columns: ColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a href="id" onClick={e=>e.preventDefault()}>{text}</a>,
        },
        {
          title: '文章类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <a href='change' onClick={(e)=>{handleChange(e,record)}}>修改</a>
                    <a href='delete' onClick={(e)=>{handleDelete(e,record)}}>删除</a>
                </Space>
            ),
        },
    ];
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
    },[]);
    // 获取数据的函数
    function fetchData() {
        // 获取所有的类型
        apiFun.getAllTypes().then((res:any)=>{
            if(res.code==="0000") {
                const typeData=res.data.map((item:any)=>item)
                setType(typeData);
            }
        })
    }
    // 删除
    function handleDelete(e:any,record:any) {
        e.preventDefault();
        apiFun.deleteType({id:record.id}).then((res:any)=>{
            if(res.code==='0000') {
                message.success(res.msg);
                // 删除成功后重新获取数据
                fetchData();
            }else {
                message.error(res.msg);
            }
        })
    }
    // 修改
    function handleChange(e:any,record:any) {
        e.preventDefault();
        setSubType(2);
        showModal();
        setIds(record.id);
    }
    // 新增
    function handleAdd() {
        setSubType(1);
        showModal();
    }
    // 新增和修改的回调函数
    const onFinish = (values: any) => {
        if(subtype===1) {
            apiFun.addType({...values}).then((res:any)=>{
                if(res.code==='0000') {
                    message.success(res.msg);
                    setOpen(false);
                    fetchData();
                }else {
                    message.error(res.msg);
                }
            })
        }else if(subtype===2) {
            apiFun.changeType({id:ids,...values}).then((res:any)=>{
                if(res.code==='0000') {
                    message.success(res.msg);
                    setOpen(false);
                    fetchData();
                }else {
                    message.error(res.msg);
                }
            })
        }
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
                title="类别"
                open={open}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
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
                        label="类别"
                        name="type"
                        rules={[{ required: true, message: 'type is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table key={33} columns={columns} dataSource={type} />
        </div>
    )
}
export default ArticlesType;


