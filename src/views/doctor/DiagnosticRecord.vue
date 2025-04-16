<script setup>
import { ref, onBeforeMount } from 'vue';
import { getMedicalRecordService, addMedicalRecordService, deleteMedicalRecordService } from '@/api/medicalRecord';
import { getDoctorSelfInfoService } from '@/api/doctor';
import { getAllResidentService } from '@/api/resident';
import { ElMessage } from 'element-plus';
const addDiagnosticRecordDialog = ref(false)
//诊断记录
const medicalRecord = ref({})
//医生基本信息
const doctorInfo = ref({});
//用于添加的就诊记录
const medicalRecordForAdd = ref({})
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
//就诊类型
const visitType = ref(['门诊', '急诊', '住院'])
//新增就诊记录时所需的查询的居民列表
const residents = ref([])

//查询居民就诊记录
const getMedicalRecord = async () => {
    let result = await getMedicalRecordService(pageQueryDto.value);
    medicalRecord.value = result.data;
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getMedicalRecord();
}
//查询医生基本信息
const getDoctorInfo = async () => {
    let result = await getDoctorSelfInfoService();
    doctorInfo.value = result.data;
}
//查询医生基本信息
const getResidentList = async () => {
    let result = await getAllResidentService();
    residents.value = result.data;
}
//点击添加按钮
const readyForAdd = async () => {
    await getDoctorInfo();
    await getResidentList();
    addDiagnosticRecordDialog.value = true;
    //为将要添加的记录赋值固定信息
    medicalRecordForAdd.value.hospitalId = doctorInfo.value.hospitalId;
    medicalRecordForAdd.value.departmentId = doctorInfo.value.departmentId;
    medicalRecordForAdd.value.doctorId = doctorInfo.value.id;
}
//添加就诊记录
const addMedicalRecord = async () => {
    if (medicalRecordForAdd.value.visitTime == null || medicalRecordForAdd.value.visitType == null ||
        medicalRecordForAdd.value.diagnosticResult == null || medicalRecordForAdd.value.diagnosticResult == '') {
        ElMessage.error("请确保信息完整")
    } else {
        await addMedicalRecordService(medicalRecordForAdd.value);
        addDiagnosticRecordDialog.value = false;
        ElMessage.success("添加成功")
        await getMedicalRecord();
    }
}

//删除就诊记录
const deleteMedicalRecord = async (row) => {
    await deleteMedicalRecordService(row.id);
    ElMessage.success("删除成功")
    await getMedicalRecord();
}

onBeforeMount(async () => {
    //查询居民就诊记录
    await getMedicalRecord();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>诊断记录</h4>
            <el-button plain type="success" @click="readyForAdd()">添加记录</el-button>
        </div>
        <el-table :data="medicalRecord.items" border style="width: 100%" stripe
            :default-sort="{ prop: 'visitTime', order: 'descending' }">
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="visitTime" label="时间" sortable width="120px" />
            <el-table-column prop="visitType" label="类型" width="60px" />
            <el-table-column prop="resident" label="居民" width="150px" />
            <el-table-column prop="hospital" label="地点" width="180px" />
            <el-table-column prop="department" label="科室" width="180px" />
            <el-table-column prop="diagnosticResult" label="诊断结果" />
            <el-table-column label="操作" width="75px">
                <template #default="scope">
                    <el-button size="small" type="danger" @click="deleteMedicalRecord(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center; margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="medicalRecord.total" @current-change="pageChange" />
        </div>
    </el-card>

    <!-- 添加就诊记录 -->
    <el-dialog v-model="addDiagnosticRecordDialog" title="添加就诊记录" width="300" align-center center>
        <el-form class="form-update form-basic-info" label-width="70px" label-position="left">
            <el-form-item label="就诊时间">
                <el-date-picker v-model="medicalRecordForAdd.visitTime" type="date" placeholder="选择日期" :size="large"
                    value-format="YYYY-MM-DD" style="width: 180px" />
            </el-form-item>
            <el-form-item label="就诊类型">
                <el-select v-model="medicalRecordForAdd.visitType" style="width: 180px" placeholder="选择类型">
                    <el-option v-for="item in visitType" :key="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="就诊地点">
                <el-input disabled :placeholder="doctorInfo.hospital" style="width:180px"></el-input>
            </el-form-item>
            <el-form-item label="就诊科室">
                <el-input disabled :placeholder="doctorInfo.department" style="width:180px"></el-input>
            </el-form-item>
            <el-form-item label="就诊医生">
                <el-input disabled :placeholder="doctorInfo.name" style="width:180px"></el-input>
            </el-form-item>
            <el-form-item label="就诊居民">
                <el-select v-model="medicalRecordForAdd.residentId" style="width: 180px" placeholder="选择" filterable>
                    <el-option v-for="item in residents" :key="item.id" :value="item.id"
                        :label="item.name + '(' + item.idNumber + ')'" />
                </el-select>
            </el-form-item>

            <el-form-item label="诊断结果">
                <el-input v-model="medicalRecordForAdd.diagnosticResult" type="textarea" autosize
                    style="width: 180px;" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addDiagnosticRecordDialog = false">取消</el-button>
                <el-button type="primary" @click="addMedicalRecord">
                    添加
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.el-card {
    width: 88% !important;
    margin: 15px auto;
}

.option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.option h4 {
    line-height: 0;
}
</style>
