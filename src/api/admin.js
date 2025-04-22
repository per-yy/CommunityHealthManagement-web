import request from '../utils/request.js'
//查询管理员个人信息
export const getAdminInfoService=()=>{
    return request.get("/admin/info/query")
}


