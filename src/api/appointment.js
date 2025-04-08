import request from '../utils/request.js'

//查询我的预约
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