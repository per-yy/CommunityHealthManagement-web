import request from '../utils/request.js'
export const getHospitalService = () => {
    return request.get("/hospital/query")
}
export const deleteHospitalService = (id) => {
    return request.delete(`/hospital/delete/${id}`);
}
export const addHospitalService = (hospital) => {
    return request.post("/hospital/add", hospital)
}
