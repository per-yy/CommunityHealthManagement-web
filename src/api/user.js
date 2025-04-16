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
//根据居民id查询账号信息
export const getUserInfoByResidentIdService=(residentId)=>{
    return request.get(`/userInfo/resident/${residentId}`);
}
//删除用户
export const deleteUserService=(userId)=>{
    return request.delete(`/user/delete/${userId}`);
}
//根据医生id查询账号信息
export const getUserInfoByDoctorIdService=(doctorId)=>{
    return request.get(`/userInfo/doctor/${doctorId}`);
}