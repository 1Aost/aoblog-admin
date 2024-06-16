import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, message, Modal, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { timestampToTime } from "@/api/utils";
import ActionRender from '@/components-antd/Display/ActionRender';
import FilterSelect from '@/components-antd/Header/FilterSelect';
import { changeCommentsStatus, getAllArticles, getComments, getIdByName, replyComments } from '@/services/Articles';
interface DataType {
  key: string,
  id: number;
  username: string;
};
interface ArticleType {
  id: number
  article_url: string
  article_img: string
  article_type: string
  article_likes: number
  article_views: number
  article_reviews: number
  article_title: string
  article_introduction: string
  article_time: string
  comments_length: number
};
interface CommentType {
  article_id: number
  comments: string
  comments_id: number
  comments_reply: string
  comments_status: number
  comments_time: string
  user_id: number
  user_name: string
};
const { TextArea } = Input;

const Reviews: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'comments_id',
      key: 'comments_id',
      render: (text) => <a href="id" onClick={e => e.preventDefault()}>{text}</a>,
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
      render: (_, record: any) => (
        <div>{timestampToTime(record.comments_time, true)}</div>
      )
    },
    {
      title: '状态',
      key: 'comments_status',
      render: (_, record: any) => (
        <Space size={[0, 8]} wrap>
          {
            record.comments_status === 0 ?
              (
                <div onClick={() => handleStatus(1, record.comments_id)}>
                  <Tooltip placement="top" title={"点击通过"} arrow={mergedArrow}>
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      未通过
                    </Tag>
                  </Tooltip>
                </div>

              ) :
              (
                <div onClick={() => handleStatus(0, record.comments_id)}>
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
        <ActionRender
          extra={
            <Button
              type="link"
              onClick={(e) => {
                handleReply(e, record)
              }}
            >
              回复
            </Button>
          }
        />
      ),
    },
  ];
  const [comments, setComments] = useState<any>([]);
  const [id, setId] = useState<number>(0);
  const [commentsid, setCommentsId] = useState<number>(0);
  const [article, setArticle] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const showModal = (): void => {
    form.resetFields();
    setOpen(true);
  };
  const handleCancel = (): void => {
    setOpen(false);
  };
  const [arrow] = useState<string>('Show');
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
  const handleStatus = (status: number, id: number) => {
    changeCommentsStatus({ id, comments_status: status }).then(res => {
      if (res.code === '0000') {
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
      } else {
        message.error(res.msg);
      }
    })
  }

  // 根据文章名称获取文章的id
  const fetchId = (name: string) => {
    getIdByName({ name }).then(res => {
      if (res.code === '0000') {
        message.success(res.msg);
        setId((res.data as Array<ArticleType>)[0].id)
      } else {
        message.error(res.msg);
      }
    });
  }

  // 获取评论数据
  const fetchData = () => {
    getComments({ id }).then(res => {
      setComments(res.data as Array<CommentType>);
    })
  }

  // 获取指定文章的所有评论信息
  useEffect(() => {
    fetchData();
  }, [id]);

  // 获取所有文章名称
  useEffect(() => {
    getAllArticles().then(res => {
      if (res.code === '0000') {
        const articleData: string[] = (res.data as Array<ArticleType>).map((item: ArticleType) => item.article_title);
        setArticle(articleData);
        setLoading(false);
      }
    });
  }, []);

  // 回复
  const handleReply = (e: any, record: any) => {
    e.preventDefault();
    showModal();
    setCommentsId(record.comments_id);
  };

  const onFinish = (values: { reply: string }) => {
    replyComments({ ...values, comments_id: commentsid }).then(res => {
      if (res.code === '0000') {
        message.success(res.msg);
        setOpen(false);
        fetchData();
      } else {
        message.error(res.msg);
      }

    })
  };

  const onChange = (value: string) => {
    fetchId(value);
  };

  return (
    <div>
      {loading ? (
        <div key={0}>Loading...</div>
      ) : (
        <FilterSelect
          placeholder="选择文章"
          style={{ width: "200px" }}
          options={article.map((title) => ({ label: title, value: title }))}
          onChange={onChange}
        />
      )}
      {
        id === 0 ?
          <h2 style={{ textAlign: "center", margin: "200px auto" }} key={2}>请先选择文章...</h2> :
          <Table key={3} style={{ width: "100%" }} columns={columns} dataSource={comments} scroll={{ x: 1500 }} />
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