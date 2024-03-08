import React, { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import hljs from 'highlight.js'; // 引入highlight.js库
import 'highlight.js/styles/github.css'; // 引入github风格的代码高亮样式
import 'react-markdown-editor-lite/lib/index.css';
import "./index.css"
import { Form } from 'antd';
import { Tag,Input,Button,Drawer,Upload,message } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import apiFun from '@/api';
import HeaderGroup from '@/components-antd/Header/HeaderGroup';
/**
 *  组件外声明只加载一次
 * */
// 声明antdesign组件
const { CheckableTag } = Tag;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
// 声明Markdown组件
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true, // 设置代码高亮的配置
  highlight(code:any, language:any) {
    if (language && hljs.getLanguage(language)) {
      try {
        return `<pre><code class="hljs language-${language}">${hljs.highlight(code, { language }).value}</code></pre>`;
      } catch (__) {}
    }

    return `<pre class="hljs"><code>${mdParser.utils.escapeHtml(code)}</code></pre>`;
  },
});
const NewArticles:React.FC=()=>{
  const [text,setText]=useState("");
  // 抽屉显示
  const [visible, setVisible] = useState(false);
  // 标签
  const [tags, setTags] = useState<any[]>([]);
  /**
   *   最后提交内容
   *
   */
  // 提交参数
  const [submitParams, setSubmitParams] = useState<any>({
    html: '',
    markdown: '',
    // user_id: '2',
    desc: '',
    title: '',
    // user: 'ss',
    date: new Date(),
    type: '',
    column: '',
    cover: '',
    image:"",
    publish: false,
  });
   // 抽屉是否展开
   const showDrawer = () => {
    setVisible(true);
  };
  // 关闭抽屉
  const onClose = () => {
    setVisible(false);
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
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {    
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setImageUrl(imageUrl);
        setSubmitParams({ ...submitParams, cover: info.file.response.url });
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
      setSubmitParams({...submitParams,image:"./images/"+res.url})
    })
  };

  // 提交
  const Submit = () => {
    apiFun.saveArticle({content:text,...submitParams}).then((res:any)=>{
      onClose();
      if(res.code==='0000') {
        message.success(res.msg);
      }else {
        message.error(res.msg);
      }
    })
  };
  // Finish!
  function handleEditorChange({ html, text }) {
    // console.log('handleEditorChange', html, text);
    setText(text);
  }
  //  选中分类Tag
  const handleChangeTag = (tagId: number, checked: any, tagType: string) => {
    const tempTags = tags;
    tempTags.map((tag, index) => (tag.id === tagId ? (tag.checked = true) : (tag.checked = false)));
    // 改变 tags变量
    setTags([...tempTags]);
    // 改变提交参数
    setSubmitParams({ ...submitParams, type: tagType });
  };
  useEffect(()=>{
    apiFun.getAllTypes().then((res:any)=>{
      if(res.code==='0000') {
        setTags(res.data);
      }else {
        message.error("出错啦，请稍后重试");
      }
    })
  },[])
  return (
    <>
      <div className="header">
        <HeaderGroup
          extra={
            <Button type="primary" onClick={showDrawer}>
              发布
            </Button>
          }
        />
      </div>
      <MdEditor 
        style={{ height: '500px' }} 
        renderHTML={text => mdParser.render(text)} 
        onChange={handleEditorChange} 
      />
      <Drawer
        title="发布文章"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={500}
        footer={(
          <>
            <Button type="primary" ghost onClick={onClose} className="btn">
              取消
            </Button>
            <Button type="primary" onClick={Submit}>
              确认并发布
            </Button>
          </>
        )}
      >
        <Form {...layout} name="nest-messages">
          <Form.Item label="分类" required>
            {tags &&
              tags.map((item, index) => (
                <CheckableTag
                  key={index}
                  checked={item.checked}
                  onChange={checked => handleChangeTag(item.id, checked, item.type)}
                >
                  {item.type}
                </CheckableTag>
              ))}
          </Form.Item>
          <Form.Item label="文章封面">
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
          <Form.Item label="文章标题">
            <Input.TextArea
              showCount
              maxLength={30}
              rows={3}
              value={submitParams.title}
              onChange={e => {
                setSubmitParams({ ...submitParams, title: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="文章简述">
            <Input.TextArea
              showCount
              maxLength={100}
              rows={4}
              value={submitParams.desc}
              onChange={e => {
                setSubmitParams({ ...submitParams, desc: e.target.value });
              }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
    
  )
}
export default NewArticles;