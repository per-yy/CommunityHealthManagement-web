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
export const getAllResidentService=()=>{
    return request.get("/resident/all/query")
}

//管理端分页查询居民列表
export const getResidentListService=(pageQueryDto)=>{
    return request.post("/resident/list/query",pageQueryDto)
}