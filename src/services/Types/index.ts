import request from "@/api/request";

// 获取所有的分类
export async function getAllTypes(): Promise<any> {
  return request.get("/api/types");
}
// 新增类别
export async function addType(params: { type: string }): Promise<any> {
  return request.post("/api/types", params);
}
// 修改类别
export async function changeType(params: { id: number, type: string }): Promise<any> {
  return request.put("/api/types", params);
}
// 根据id删除类别
export async function deleteType(params: { id: number }): Promise<any> {
  return request.delete("/api/types", params);
}