import request from '../utils/request.js'

//查询某个居民的咨询记录
export const getConsultationService = (pageQueryDto) => {
    return request.post("/consultation/query", pageQueryDto)
}

//删除居民咨询
export const deleteConsultationService=(id)=>{
    return request.delete(`/consultation/delete/${id}`);
}

//添加居民咨询
export const addConsultationService=(consultation)=>{
    return request.post("/consultation/add",consultation);
}
//查询全部咨询
export const getAllConsultationService=(pageQueryDto)=>{
    return request.post("/consultation/queryAll",pageQueryDto)
}
//回复咨询
export const replyConsultationService=(consultation)=>{
    return request.post("/consultation/reply",consultation);
}