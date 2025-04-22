import request from '../utils/request.js'
//查询居民健康报告
export const getHealthReportService = (residentId) => {
    return request.get(`/healthReport/query/${residentId}`)
}
//更新健康报告
export const updateHealthReportService=(healthReport)=>{
    return request.post("/healthReport/update",healthReport);
}