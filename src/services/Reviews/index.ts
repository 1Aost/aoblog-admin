import request from "@/api/request";

// 获取所有的留言
export async function getReviews(): Promise<any> {
  return request.get("/api/reviews");
}

// 根据id修改留言的状态
export async function changeReviewsStatus(params: {
  id: number,
  review_status: number,
}): Promise<any> {
  return request.post("/api/reviews/reviewstatus", params);
}

// 根据id管理员回复留言
export async function replyReviews(params: {
  id: number,
  reply: string,
}): Promise<any> {
  return request.post("/api/reviews/replyreview", params);
}