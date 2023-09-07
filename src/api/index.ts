// 引入刚才的http.js文件
import https from './request';	
// 设置个对象，就不用一个个暴露了，直接暴露对象
interface MyObject {
	[key: string]: any;
}
let apiFun :MyObject={};
/* 登录 */
apiFun.login=function(params:any) {
	return https.post("/api/admin",params);
}

// 1. 用户管理
/* 获取所有用户信息 */
apiFun.getAllUsers=function(params:any) {
	return https.get("/users",params);
}
/* 根据id删除用户 */
apiFun.deleteUser=function(params:any) {
	return https.get("/users/no",params);
}
/* 新增用户 */
apiFun.addUser=function(params:any) {
	return https.post("/users/new",params);
}
/* 获取所有管理员信息 */
apiFun.getAllAdmins=function(params:any) {
	return https.post("/api/admin/all",params);
}
/* 根据id删除管理员 */
apiFun.deleteAdmin=function(params:any) {
	return https.get("/api/admin/no",params);
}
/* 新增管理员 */
apiFun.addAdmin=function(params:any) {
	return https.post("/api/admin/new",params);
}
/* 修改管理员 */
apiFun.changeAdmin=function(params:any) {
	return https.post("/api/admin/oldtonew",params);
}
/* 上传头像 */
apiFun.uploadAvatar=function(params:any) {
	return https.postImg("/api/Upload/avatar",params)
}
/* 根据token获取管理员信息 */
apiFun.getAdminByToken=function(params:any) {
	return https.post("/api/admin/bytoken",params);
}

// 2. 留言管理
/* 获取所有的留言 */
apiFun.getReviews=function(params:any) {
	return https.get("/api/reviews",params);
}
/* 根据id删除留言 */
apiFun.deleteReviews=function(params:any) {
	return https.get("/api/reviews/noreview",params);
}
/* 根据id修改留言的状态 */
apiFun.changeReviewsStatus=function(params:any) {
	return https.post("/api/reviews/reviewstatus",params);
}
/* 根据id管理员回复留言 */
apiFun.replyReviews=function(params:any) {
	return https.post("/api/reviews/replyreview",params);
}

// 3. 文章管理
/* 获取所有的文章 */
apiFun.getAllArticles=function(params:any) {
	return https.get("/api/articles/all",params);
}
/* 上传图片 */
apiFun.uploadImagwe=function(params:any) {
	return https.postImg("/api/Upload",params)
}
/* 保存文章内容 */
apiFun.saveArticle=function(params:any) {
	return https.post("/api/articles/saveArticle",params);
}
/* 删除文章 */
apiFun.deleteArticle=function(params:any) {
	return https.get("/api/articles/noarticles",params);
}
/* 修改文章 */
apiFun.changeArticle=function(params:any) {
	return https.post("/api/articles/oldtonew",params);
}
/* 根据文章的id获取所有评论 */
apiFun.getComments=function(params:any) {
	return https.get("/api/articles/comments",params);
}
/* 根据文章的名称获取文章id */
apiFun.getIdByName=function(params:any) {
	return https.get("/api/articles/idbyname",params);
}
/* 根据id修改文章评论的状态 */
apiFun.changeCommentsStatus=function(params:any) {
	return https.post("/api/articles/commentstatus",params);
}
/* 根据id删除文章评论 */
apiFun.deleteComments=function(params:any) {
	return https.get("/api/articles/nocomment",params);
}
/* 根据id管理员回复文章评论 */
apiFun.replyComments=function(params:any) {
	return https.post("/api/articles/replycomment",params);
}

// 4.类别管理
/* 获取所有的分类 */
apiFun.getAllTypes=function() {
	return https.get("/api/types/all");
}
/* 新增类别 */
apiFun.addType=function(params:any) {
	return https.post("/api/types/new",params);
}
/* 修改类别 */
apiFun.changeType=function(params:any) {
	return https.post("/api/types/oldtonew",params);
}
/* 根据id删除类别 */
apiFun.deleteType=function(params:any) {
	return https.get("/api/types/no",params);
}

apiFun.submitLikes=function(params:any) {
	return https.post("/api/likes/new",params);
}
apiFun.selectLikes=function(params:any) {
	return https.post("/api/likes/search",params);
}
apiFun.deleteLikes=function(params:any) {
	return https.post("/api/likes/no",params);
}
apiFun.selectLikesByUserId=function(params:any) {
	return https.post("/api/likes/searchbyuserid",params);
}
apiFun.selectLikesByArticleId=function(params:any) {
	return https.post("/api/likes/searchbyarticleid",params);
}


//暴露出这个对象
export default apiFun;