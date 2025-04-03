import request from '../utils/request.js'

//查询居民咨询记录
export const getConsultationService=()=>{
    return request.get("/consultation/query")
}