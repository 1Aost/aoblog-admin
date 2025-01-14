import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Upload } from 'antd';
import { Button, Modal, Table, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import type { ColumnsType } from 'antd/es/table';
import { timestampToTime } from "@/api/utils"
import ActionRender from '@/components-antd/Display/ActionRender';
import { getAllTypes } from '@/services/Types';
import { changeArticle, deleteArticle, getAllArticles } from '@/services/Articles';
import { uploadImagwe } from '@/services/Upload';
interface DataType {
  key: string,
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
}
interface ChangeType {
  article_introduction: string
  article_title: string
  article_type: string
}
interface MyType {
  id: number
  type: string
}
const { Option } = Select;
const { TextArea } = Input;
const ArticlesList: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [ids, setIds] = useState<number>(0);
  const [type, setType] = useState<string[]>([]);
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
      render: (_, record: any) => (
        <div>
          <img style={{ width: "100%" }} src={record.article_img} alt="" />
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
        <ActionRender
          onEdit={() => handleChange(record)}
          onDelete={() => handleDelete(record)}
        />
      ),
    },
  ];
  // 修改中type的选择
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onTypeChange = (value: string) => {
    // setSubtype(value);
  };
  // Modal对话框的展示
  const showModal: () => void = (): void => {
    form.resetFields();
    setOpen(true);
  };
  // 关闭对话框
  const handleCancel: () => void = (): void => {
    setOpen(false);
  };
  useEffect(() => {
    fetchData();
    const typeData: string[] = [];
    // 获取所有的类型
    getAllTypes().then(res => {
      (res.data as Array<MyType>).map((item: MyType) => {
        return typeData.push(item.type);
      })
      setType(typeData);
    }).catch(_err => {
      message.error("出错了，请稍后重试");
    })
  }, []);

  // 获取数据的函数
  const fetchData = () => {
    getAllArticles().then(res => {
      const newData = (res.data as Array<ArticleType>).map((item: ArticleType, index) => ({
        ...item,
        // review_time:timestampToTime(item.review_time,true),
        article_time: timestampToTime(item.article_time, true),
        key: (index + 1).toString(),
      }));
      setData(newData);
    }).catch(_err => {
      message.error("出错了，请联系管理员");
    })
  };

  // 删除
  const handleDelete = (record: DataType) => {
    deleteArticle({ id: record.id }).then(res => {
      message.success(res.msg);
      // 删除成功后重新获取数据
      fetchData();
    })
  }
  // 修改
  const handleChange = (record: DataType) => {
    showModal();
    setIds(record.id);
    form.setFieldsValue(record); // 设置表单的值
  }
  // 修改的函数
  const onFinish = (values: ChangeType): void => {
    changeArticle({ id: ids, ...values, article_img: imageUrl }).then(res => {
      message.success(res.msg);
      setOpen(false);
      fetchData();
      form.resetFields();
    })
  };
  /**
   *  上传图片
   */
  // 图片地址
  const [imageUrl, setImageUrl] = useState<string>();
  // 加载
  const [loading, setLoading] = useState<boolean>(false);
  // 上传前
  const beforeUpload = (file: { type: string; size: number; }): boolean => {
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
    uploadImagwe(formData).then(res => {
      setImageUrl("./images/" + res.url);
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
          autoComplete="off"
        >
          <Form.Item name="article_type" label="文章类型" rules={[{ required: true }]}>
            <Select
              placeholder="Select a type"
              onChange={onTypeChange}
              allowClear
            >
              {
                type.map((item) => {
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
          <Form.Item label="文章封面照片" rules={[{ required: true }]} >
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
          </Form.Item>
        </Form>
      </Modal>
      <Table style={{ width: "100%" }} columns={columns} dataSource={data} scroll={{ x: 1500 }} />
    </div>
  )
}
export default ArticlesList;


