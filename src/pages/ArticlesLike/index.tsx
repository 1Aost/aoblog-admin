import React, { useEffect, useState } from 'react'
import { message, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import apiFun from '../../api';
interface MessageType {
    code: string
    msg:string
    data: null | Array<ArticleType> | Array<LikeType>
}
interface LikeType {
    likes_id: number,
    user_id2: number,
    article_id1: number,
    user_name:string
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
const ArticlesLike:React.FC=()=>{
    const [articleName,setArticleName]=useState<string>('');
    const columns: ColumnsType<LikeType> = [
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
    
    const [likes,setLikes]=useState<Array<LikeType>>([]);
    const [id,setId]=useState<number>(0);
    const [article,setArticle]=useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    // 根据文章名称获取文章的id
    async function fetchId(name:string): Promise<void> {
        try {
            const res: MessageType=await apiFun.getIdByName({name});
            if(res.code==='0000') {
                setId((res.data as Array<ArticleType>)[0].id)
            }else {
                message.error(res.msg);
            }
        }catch(err) {
            message.error("出错了，请稍后重试");
        }
    }
    // 获取点赞数据
    async function fetchData(): Promise<void> {
        try {
            const res: MessageType=await apiFun.selectLikesByArticleId({id:id});
            console.log(res);
            if(res.code==='0000') {
                setLikes(res.data as Array<LikeType>);
            }else {
                message.error(res.msg);
            }
        }catch(err) {
            message.error("出错了，请联系管理员");
        }
    }
    // 获取指定文章的所有点赞信息
    useEffect(()=>{
        fetchData();
    },[id])
    // 获取所有文章名称
    useEffect(() => {
        (async function() {
            try {
                const res: MessageType=await apiFun.getAllArticles();
                if (res.code === '0000') {
                    const articleData: string[] = (res.data as Array<ArticleType>).map((item: ArticleType) => item.article_title);
                    setArticle(articleData);
                    setLoading(false);
                }else {
                    message.error(res.msg);
                }
            }catch(err) {
                message.error("出错了，请联系管理员");
            }
        })()
    }, []);

    const onChange: (value: string) => void = (value: string): void => {
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