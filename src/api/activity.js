import request from '../utils/request.js'

//查询社区活动
export const getActivityService = (pageQueryDto) => {
    return request.post("/activity/query", pageQueryDto)
}
//报名活动
export const joinActivityService = (activityId) => {
    return request.get(`/activity/join/${activityId}`)
}
//查询活动及报名的居民
export const getActivityAndResidentService = (pageQueryDto) => {
    return request.post("/activity/queryAll", pageQueryDto)
}
//发布活动
export const addActivityService = (activity) => {
    return request.post("/activity/add", activity);
}
//删除活动
export const deleteActivityService = (activityId) => {
    return request.delete(`/activity/delete/${activityId}`);
}