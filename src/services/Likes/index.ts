import request from "@/api/request";

// 文章的点赞信息
export async function selectLikes(params: { article_id: number }): Promise<any> {
  return request.get("/api/likes", params);
}