import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined  } from '@ant-design/icons';
import {timestampToTime} from "../../api/utils"
import apiFun from '../../api';
interface DataType {
    key:string,
    id: number;
    username: string;
}
const {TextArea}=Input;
const Reviews:React.FC=()=>{
    const columns: ColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'comments_id',
            key: 'comments_id',
            render: (text) => <a href="id" onClick={e=>e.preventDefault()}>{text}</a>,
        },
        {
            title: '用户',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '评论内容',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: '评论时间',
            dataIndex: 'comments_time',
            key: 'comments_time',
            render:(_,record:any)=>(
                <div>{timestampToTime(record.comments_time,true)}</div>
            )
        },
        {
            title: '状态',
            key: 'comments_status',
            render: (_, record:any) => (
                <Space size={[0, 8]} wrap>
                    {
                        record.comments_status===0?
                        (
                            <div onClick={handleStatus(1,record.comments_id)}>
                               <Tooltip placement="top" title={"点击通过"} arrow={mergedArrow}>
                                    <Tag icon={<CloseCircleOutlined />} color="error">
                                        未通过
                                    </Tag>
                                </Tooltip>
                            </div>
                            
                        ):
                        (
                            <div onClick={handleStatus(0,record.comments_id)}>
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
            dataIndex: 'comments_reply',
            key: 'comments_reply',
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
            <Space size="middle">
                <a href='reply' onClick={(e)=>handleReply(e,record)}>回复</a>
                {/* <a onClick={handleDelete(record)}>删除</a> */}
            </Space>
            ),
        },
    ];
    const [comments,setComments]=useState<any>([]);
    const [id,setId]=useState<any>(0);
    const [commentsid,setCommentsId]=useState<any>(0);
    const [article,setArticle]=useState<any>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [open, setOpen] = useState(false);
    const [form]=Form.useForm();
    const showModal = () => {
        form.resetFields();
        setOpen(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
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
            apiFun.changeCommentsStatus({id,comments_status:status}).then((res:any)=>{
                if(res.code==='0000') {
                    message.success(res.msg);
                    // 更新 data 数据
                    setComments((prevData) =>
                        prevData.map((item) => {
                            if (item.id === id) {
                                return { ...item, review_status: status };
                            }
                            return item;
                        })
                    );
                    fetchData();
                }else {
                    message.error(res.msg);
                }
            })   
        }
    }
    // 根据文章名称获取文章的id
    function fetchId(name:string) {
        apiFun.getIdByName({name}).then((res:any) => {
            if(res.code==='0000') {
                message.success(res.msg);
                setId(res.data[0].id)
            }else {
                message.error(res.msg);
            }
        });
    }
    // 获取评论数据
    function fetchData() {
        apiFun.getComments({id}).then((res:any)=>{
            setComments(res.data)
        })
    }
    // 获取指定文章的所有评论信息
    useEffect(()=>{
        fetchData();
    },[id])
    // 获取所有文章名称
    useEffect(() => {
        apiFun.getAllArticles().then((res: any) => {
            if (res.code === '0000') {
                const articleData = res.data.map((item: any) => item.article_title);
                setArticle(articleData);
                setLoading(false);
            }
        });
    }, []);
    // 删除
    /* function handleDelete(record:any) {
        return ()=>{
            apiFun.deleteComments({comments_id:record.comments_id}).then((res:any)=>{
                console.log(res);
                if(res.code==='0000') {
                    message.success(res.msg);
                    // 删除成功后重新获取数据
                    fetchData();
                }else {
                    message.error(res.msg);
                }
            })
        }
    } */
    // 回复
    function handleReply(e:any,record:any) {
        e.preventDefault();
        showModal();
        setCommentsId(record.comments_id);
    }
    const onFinish = (values: any) => {
        apiFun.replyComments({...values,comments_id:commentsid}).then((res:any)=>{
            if(res.code==='0000') {
                message.success(res.msg);
                setOpen(false);
                fetchData();
            }else {
                message.error(res.msg);
            }
            
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const onChange = (value: string) => {
        // console.log(`selected ${value}`);
        fetchId(value);
    };
    return (
        <div>
            {loading ? (
                <div key={0}>Loading...</div>
            ) : (
                <Select
                    key={1}
                    showSearch
                    placeholder="选择文章"
                    optionFilterProp="children"
                    onChange={onChange}
                    options={article.map((title) => ({ value: title }))}
                />
            )}
            {
                id===0?
                <h2 style={{textAlign:"center",margin:"200px auto"}} key={2}>请先选择文章...</h2>:
                <Table key={3} style={{width:"100%"}} columns={columns} dataSource={comments} scroll={{ x: 1500 }} />
            }
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
export default Reviews;