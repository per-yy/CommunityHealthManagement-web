import request from '../utils/request.js'
//根据医生id查询时间表
export const getScheduleService=(doctorId)=>{
    return request.get(`/schedule/query/${doctorId}`)
}