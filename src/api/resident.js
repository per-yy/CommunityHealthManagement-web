import request from '../utils/request.js'

//查询居民基本信息
export const getResidentInfoService = () => {
    return request.get("/resident/info/query")
}
//修改居民基本信息
export const updateResidentInfoService = (residentInfo) => {
    return request.post("/resident/info/update", residentInfo)
}
//查询所有居民
export const getResidentListService=()=>{
    return request.get("/resident/list/query")
}
