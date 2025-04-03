import request from '../utils/request.js'
//查询居民就诊记录
export const getMedicalRecordService=()=>{
    return request.get("/medicalRecord/query")
}

//添加居民就诊记录
export const addMedicalRecordService=(MedicalRecord)=>{
    return request.post("/medicalRecord/add",MedicalRecord)
}

//删除居民就诊记录
export const deleteMedicalRecordService=(id)=>{
    return request.delete(`/medicalRecord/delete/${id}`)
}
