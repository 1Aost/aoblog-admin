import request from "@/api/request";

interface ChangeType {
  id: number
  article_introduction: string
  article_title: string
  article_type: string
  article_img: string | undefined
}

// 获取所有的文章
export async function getAllArticles(): Promise<any> {
  return request.get("/api/articles");
}

// 保存文章内容
export async function saveArticle(params: {
  image: string,
  title: string,
  desc: string,
  content: string,
  type: string,
  date: Date,
}): Promise<any> {
  return request.post("/api/articles", params);
}

// 删除文章
export async function deleteArticle(params: { id: number }): Promise<any> {
  return request.delete("/api/articles", params);
}

// 修改文章
export async function changeArticle(params: ChangeType): Promise<any> {
  return request.put("/api/articles", params);
}

// 获取所有评论
export async function getComments(params: { article_id?: number, user_id?: number }): Promise<any> {
  return request.get("/api/articles/comments", params);
}

// 根据文章的名称获取文章id
export async function getIdByName(params: { name: string }): Promise<any> {
  return request.get("/api/articles/idByName", params);
}

// 根据id修改文章评论的状态
export async function changeCommentsStatus(params: { id: number, comments_status: number }): Promise<any> {
  return request.put("/api/articles/comments/tatus", params);
}

// 根据id管理员回复文章评论
export async function replyComments(params: { reply: string, comments_id: number }): Promise<any> {
  return request.post("/api/articles/comment/reply", params);
}

// 上传图片
export async function uploadImagwe(params: FormData): Promise<any> {
  return request.postImg("/api/Upload", params)
}