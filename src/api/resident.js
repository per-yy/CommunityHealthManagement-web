import request from '../utils/request.js'

//查询居民基本信息
export const getResidentInfoService = () => {
    return request.get("/resident/info/query")
}

//查询居民健康信息
export const getHealthInfoService = () => {
    return request.get("/resident/health/query")
}

//修改居民基本信息
export const updateResidentInfoService = (residentInfo) => {
    return request.post("/resident/info/update",residentInfo)
}

//修改居民健康信息
export const updateHealthInfoService = (healthInfo) => {
    return request.post("/resident/health/update", healthInfo)
}