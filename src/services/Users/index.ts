import request from "@/api/request";

// 获取所有用户信息
export async function getAllUsers(): Promise<any> {
  return request.get("/users");
}

// 根据id删除用户
export async function deleteUser(params: { id: number }): Promise<any> {
  return request.get("/users/no", params);
}

// 新增用户
export async function addUser(params: { username: string, password: string, avatar: string | undefined }): Promise<any> {
  return request.post("/users/new", params);
}