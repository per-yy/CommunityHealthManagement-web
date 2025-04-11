import request from '../utils/request.js'
//根据医生id查询时间表
export const getScheduleService=(doctorId)=>{
    return request.get(`/schedule/query/${doctorId}`)
}
//查询医生的时间段下及其下面的预约居民
export const getScheduleAndResidentService=(pageQueryDto)=>{
    return request.post("/schedule/query/appointment",pageQueryDto)
}

//添加时间段
export const addScheduleService=(schedule)=>{
    return request.post("/schedule/add",schedule);
}
//删除时段
export const deleteScheduleService=(scheduleId)=>{
    return request.delete(`/schedule/delete/${scheduleId}`)
}