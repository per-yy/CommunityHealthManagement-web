import request from '../utils/request.js'
export const getDepartmentService = (hospitalId) => {
    return request.get(`/department/query/${hospitalId}`)
}
export const getDepartmentListService = (pageQueryDto) => {
    return request.post("/department/list", pageQueryDto)
}
export const deleteDepartmentService = (id) => {
    return request.delete(`/department/delete/${id}`);
}

export const addDepartmentService = (department) => {
    return request.post("/department/add", department)
}