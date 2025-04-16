import request from '../utils/request.js'

//查询居民健康信息
export const getHealthInfoService = () => {
    return request.get("/health/query")
}

//修改居民健康信息
export const updateHealthInfoService = (healthInfo) => {
    return request.post("/health/update", healthInfo)
}
//根据居民id查询健康信息
export const getHealthInfoByResidentIdService=(residentId)=>{
    return request.get(`/health/query/${residentId}`);
}
