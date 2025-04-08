import request from '../utils/request.js'
export const getHospitalService = () => {
    return request.get("/hospital/query")
}