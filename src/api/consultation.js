import request from '../utils/request.js'

//查询居民咨询记录
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