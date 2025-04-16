import request from '../utils/request.js'
//根据科室Id查询医生
export const getDoctorService = (departmentId) => {
    return request.get(`/doctor/all/query/${departmentId}`)
}
//查询医生个人信息
export const getDoctorSelfInfoService=()=>{
    return request.get("/doctor/info/query")
}
//修改医生基本信息
export const updateDoctorInfoService=(doctor)=>{
    return request.post("/doctor/info/update",doctor)
}
//查询医生列表
export const getDoctorListService=(pageQueryDto)=>{
    return request.post("/doctor/list/query",pageQueryDto)
}