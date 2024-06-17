import request from "@/api/request";

// 上传图片
export async function uploadImagwe(params: FormData): Promise<any> {
  return request.postImg("/api/Upload", params)
}

// 上传头像
export async function uploadAvatar(params: FormData): Promise<any> {
  return request.postImg("/api/Upload/avatar", params)
}