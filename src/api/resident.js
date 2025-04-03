import request from '../utils/request.js'

//查询居民基本信息
export const getResidentInfoService = () => {
    return request.get("/resident/query")
}
//修改居民基本信息
export const updateResidentInfoService = (residentInfo) => {
    return request.post("/resident/update", residentInfo)
}

