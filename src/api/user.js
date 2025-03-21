import request from '../utils/request.js'

//登录
export const loginService = (user) => {
    return request.post("/login", user);
}

//注册
export const registerService = (user) => {
    return request.post("/register", user);
}

//发送邮箱验证码
export const sendService = (email) => {
    return request.post("/send", { email });
}

//修改密码
export const changePasswordService=(user)=>{
    return request.post("/changePassword",user);
}

//查询用户账号信息
export const getUserInfoService=()=>{
    return request.get("/userInfo/query");
}

//修改账号信息
export const updateUserInfoService=(user)=>{
    return request.post("/userInfo/update",user)
}