import request from '../utils/request.js'
export const getDepartmentService = (hospitalId) => {
    return request.get(`/department/query/${hospitalId}`)
}