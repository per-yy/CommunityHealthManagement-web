import request from '../utils/request.js'
//根据科室Id查询医生
export const getDoctorService = (departmentId) => {
    return request.get(`/doctor/query/${departmentId}`)
}