import { message, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react'
import apiFun from '../../api';
interface DataType {
    likes_id: number,
    user_id2: number,
    article_id1: number,
    user_name:string
}
const ArticlesLike:React.FC=()=>{
    const [articleName,setArticleName]=useState<string>('');
    const columns: ColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'likes_id',
            key: 'likes_id',
            render: (text) => <a href="id" onClick={e=>e.preventDefault()}>{text}</a>,
        },
        {
            title: '文章',
            dataIndex: 'article_name',
            key: 'article_name',
            render:()=><Tag color="cyan">{articleName}</Tag>
        },
        {
            title: '用户',
            dataIndex: 'user_name',
            key: 'user_name',
        },
    ];
    
    const [likes,setLikes]=useState<any>([]);
    const [id,setId]=useState<any>(0);
    const [article,setArticle]=useState<any>([]);
    const [loading, setLoading] = useState(true); // Loading state
    // 根据文章名称获取文章的id
    function fetchId(name:string) {
        apiFun.getIdByName({name}).then((res:any) => {
            if(res.code==='0000') {
                setId(res.data[0].id)
            }else {
                message.error(res.msg);
            }
        });
    }
    // 获取点赞数据
    function fetchData() {
        apiFun.selectLikesByArticleId({id:id}).then((res:any)=>{
            if(res.code==='0000') {
                setLikes(res.data);
            }else {
                message.error(res.msg);
            }
        })
    }
    // 获取指定文章的所有点赞信息
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

    const onChange = (value: string) => {
        setArticleName(value);
        fetchId(value);
    };
    return (
        <div>
            {loading ? (
                <div>Loading...</div>
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
                <h2 key={11} style={{textAlign:"center",margin:"200px auto"}}>请先选择文章...</h2>:
                <Table key={22} columns={columns} dataSource={likes} />
            }
        </div>
    )
}
export default ArticlesLike;