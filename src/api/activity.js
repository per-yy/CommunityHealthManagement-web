import request from '../utils/request.js'

//查询社区活动
export const getActivityService = (pageQueryDto) => {
    return request.post("/activity/query", pageQueryDto)
}
//报名活动
export const joinActivityService=(activityId)=>{
    return request.get(`/activity/join/${activityId}`)
}