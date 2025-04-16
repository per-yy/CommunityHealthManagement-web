import request from '../utils/request.js'

//查询居民的预约
export const getAppointmentService = (pageQueryDto) => {
    return request.post("/appointment/query", pageQueryDto);
}

//取消预约
export const cancelAppointmentService=(appointment)=>{
    return request.post("/appointment/delete",appointment);
}

//新增预约
export const addAppointmentService=(appointment)=>{
    return request.post("/appointment/add",appointment);
}

//管理端查询预约记录
export const getAllAppointmentService=(pageQueryDto)=>{
    return request.post("/appointment/all",pageQueryDto)
}