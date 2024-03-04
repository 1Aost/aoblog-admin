import React, { useEffect, useState, useMemo } from 'react'
import { Space, Tooltip, Table, Tag, theme, message, Form, Button, Modal, Input } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined  } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import apiFun from '../../api';
import {timestampToTime} from "../../api/utils"
import ActionRender from '../../components-antd/Display/ActionRender';
interface DataType {
    key:string,
    id: number;
    user_name: string;
    review_email:string;
    review_message:string;
    review_time:string;
}
const {TextArea} = Input;
const Customer:React.FC=()=>{
    const [arrow] = useState('Show');
    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);
    // 修改状态
    function handleStatus(status:number,id:number) {
        return ()=>{
            console.log(status,id);
            apiFun.changeReviewsStatus({id,review_status:status}).then((res:any)=>{
                console.log(res);
                if(res.code==='0000') {
                    message.success(res.msg);
                    // 更新 data 数据
                    setData((prevData) =>
                        prevData.map((item) => {
                            if (item.id === id) {
                                return { ...item, review_status: status };
                            }
                            return item;
                        })
                    );
                }else {
                    message.error(res.msg);
                }
            })   
        }
    }
    const columns: ColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a href="id" onClick={e=>e.preventDefault()}>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Email',
            dataIndex: 'review_email',
            key: 'review_email',
        },
        {
            title: 'Message',
            dataIndex: 'review_message',
            key: 'review_message',
        },
        {
            title: 'Time',
            dataIndex: 'review_time',
            key: 'review_time',
        },
        {
            title: '状态',
            key: 'review_status',
            render: (_, record:any) => (
                <Space size={[0, 8]} wrap>
                    {
                        record.review_status===0?
                        (
                            <div onClick={handleStatus(1,record.id)}>
                               <Tooltip placement="top" title={"点击通过"} arrow={mergedArrow}>
                                    <Tag icon={<CloseCircleOutlined />} color="error">
                                        未通过
                                    </Tag>
                                </Tooltip>
                            </div>
                            
                        ):
                        (
                            <div onClick={handleStatus(0,record.id)}>
                               <Tooltip placement="top" title={"点击关闭"} arrow={mergedArrow}>
                                    <Tag icon={<CheckCircleOutlined />} color="success">
                                        已通过
                                    </Tag>
                                </Tooltip>
                            </div>
                            
                        )
                    }
                </Space>
            ),
        },
        {
            title: '回复内容',
            dataIndex: 'review_reply',
            key: 'review_reply',
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <ActionRender
                    extra={
                        <Button
                            type="link"
                            onClick={(e) => {
                                handleReply(e,record)
                            }}
                        >
                            回复
                        </Button>
                    }
                />
            ),
        },
    ];
    const [data,setData]=useState<DataType[]>([]);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [open, setOpen] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [form]=Form.useForm();
    const showModal = (): void => {
        form.resetFields();
        setOpen(true);
    };
    const handleCancel = (): void => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    useEffect(()=>{
        fetchData();
    },[]);
    // 获取数据的函数
    function fetchData(): void {
        apiFun.getReviews().then((res:any) => {
            const newData = res.data.map((item, index) => ({
                ...item,
                review_time:timestampToTime(item.review_time,true),
                key: (index + 1).toString(),
            }));
            setData(newData);
        });
    }
    // 回复
    function handleReply(e:any,record:any) {
        e.preventDefault();
        showModal();
        setId(record.id);
    }
    const onFinish = (values: any) => {
        apiFun.replyReviews({...values,id:id}).then((res:any)=>{
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
    return (
        <div
            style={{
                padding: 24,
                minHeight: 624,
                background: colorBgContainer,
            }}
        >
            <Table style={{width:"100%"}} columns={columns} dataSource={data} scroll={{ x: 1500 }} />
            <Modal
                title="回复"
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
                        label="回复内容"
                        name="reply"
                        rules={[{ required: true, message: 'Please input your reply!' }]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default Customer;


