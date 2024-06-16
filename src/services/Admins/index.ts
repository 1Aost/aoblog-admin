import request from "@/api/request";

export async function login(params: {
  username: string,
  password: string,
}): Promise<any> {
  return request.post("/api/admin", params);
}

// 获取所有管理员信息
export async function getAllAdmins(): Promise<any> {
  return request.post("/api/admin/all");
}

// 根据id删除管理员
export async function deleteAdmin(params: { id: number }): Promise<any> {
  return request.get("api/admin/no", params);
}

// 新增管理员
export async function addAdmin(params: {
  admin_password: string,
  admin_type: string,
  admin_username: string,
  avatar: string | undefined,
}): Promise<any> {
  return request.post("/api/admin/new", params);
}

// 修改管理员
export async function changeAdmin(params: {
  id: number,
  admin_username: string,
  admin_password: string,
  avatar: string | undefined,
  admin_type: string,
}): Promise<any> {
  return request.post("/api/admin/oldtonew", params);
}

// 上传头像
export async function uploadAvatar(params: FormData): Promise<any> {
  return request.postImg("/api/Upload/avatar", params)
}

// 根据token获取管理员信息
export async function getAdminByToken(params: { admin_token: string | null }): Promise<any> {
  return request.post("/api/admin/bytoken", params);
}