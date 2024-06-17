import React, { useEffect, useState } from 'react'
import { Form, Input } from 'antd';
import { Button, Modal, Table, message } from 'antd'
import { PlusOutlined } from "@ant-design/icons"
import type { ColumnsType } from 'antd/es/table';
import ActionRender from '@/components-antd/Display/ActionRender';
import HeaderGroup from '@/components-antd/Header/HeaderGroup';
import { addType, changeType, deleteType, getAllTypes } from '@/services/Types';
interface DataType {
  id: number;
  type: string
}
interface MyType {
  id: number
  type: string
}
const ArticlesType: React.FC = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [ids, setIds] = useState<number>(0);
  const [type, setType] = useState<MyType[]>([]);
  const [subtype, setSubType] = useState<number>(0);
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a href="id" onClick={e => e.preventDefault()}>{text}</a>,
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
        <ActionRender
          onEdit={() => handleChange(record)}
          onDelete={() => handleDelete(record)}
        />
      ),
    },
  ];
  // Modal对话框的展示
  const showModal = (): void => {
    form.resetFields();
    setOpen(true);
  };
  // 关闭对话框
  const handleCancel = (): void => {
    setOpen(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  // 获取数据的函数
  const fetchData = () => {
    // 获取所有的类型
    getAllTypes().then(res => {
      const typeData: MyType[] = (res.data as Array<MyType>).map((item: MyType) => item)
      setType(typeData);
    }).catch(_err => {
      message.error("出错了，请稍后重试");
    })
  };
  // 删除
  const handleDelete = (record: DataType) => {
    deleteType({ id: record.id }).then(res => {
      message.success(res.msg);
      // 删除成功后重新获取数据
      fetchData();
    })
  }
  // 修改
  const handleChange = (record: DataType) => {
    setSubType(2);
    showModal();
    setIds(record.id);
  }
  // 新增
  const handleAdd = () => {
    setSubType(1);
    showModal();
  }
  // 新增和修改的回调函数
  const onFinish = (values: { type: string }): void => {
    if (subtype === 1) {
      addType({ ...values }).then(res => {
        message.success(res.msg);
        setOpen(false);
        fetchData();
      })
    } else if (subtype === 2) {
      changeType({ id: ids, ...values }).then(res => {
        message.success(res.msg);
        setOpen(false);
        fetchData();
      })
    }
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: 624,
      }}
    >
      <HeaderGroup>
        <Button className='btn' onClick={handleAdd} type="primary" icon={<PlusOutlined />}>
          新增
        </Button>
      </HeaderGroup>
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


