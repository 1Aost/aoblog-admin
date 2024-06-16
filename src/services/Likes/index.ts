import request from "@/api/request";

// 文章的点赞信息
export async function selectLikesByArticleId(params: { id: number }): Promise<any> {
  return request.post("/api/likes/searchbyarticleid", params);
}