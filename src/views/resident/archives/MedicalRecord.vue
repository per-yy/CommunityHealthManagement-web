<script setup>
import { ref, onBeforeMount } from 'vue';
import { getMedicalRecordService, addMedicalRecordService, deleteMedicalRecordService } from '@/api/medicalRecord';
import { ElMessage } from 'element-plus';
const addMedicalRecordDialog = ref(false)
//诊断记录
const medicalRecord = ref({})

//用于添加的就诊记录
const medicalRecordForAdd = ref({})
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
//就诊类型
const visitType = ref(['门诊', '急诊', '住院'])

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
//添加就诊记录
const addMedicalRecord = async () => {
    if (medicalRecordForAdd.value == null || medicalRecordForAdd.value.visitTime == null ||
        medicalRecordForAdd.value.visitType == null || medicalRecordForAdd.value.hospital == null ||
        medicalRecordForAdd.value.department == null || medicalRecordForAdd.value.doctor == null ||
        medicalRecordForAdd.value.diagnosticResult == null || medicalRecordForAdd.value.hospital == '' ||
        medicalRecordForAdd.value.department == '' || medicalRecordForAdd.value.doctor == '' ||
        medicalRecordForAdd.value.diagnosticResult == '') {
        ElMessage.error("请确保信息完整")
    } else {
        await addMedicalRecordService(medicalRecordForAdd.value);
        addMedicalRecordDialog.value = false;
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
            <h4>就诊记录</h4>
            <el-button plain type="success" @click="addMedicalRecordDialog = true">添加记录</el-button>
        </div>
        <el-table :data="medicalRecord.items" border style="width: 100%" stripe
            :default-sort="{ prop: 'visitTime', order: 'descending' }">
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="visitTime" label="时间" sortable width="120px" />
            <el-table-column prop="visitType" label="类型" width="60px" />
            <el-table-column prop="hospital" label="地点" width="180px"/>
            <el-table-column prop="department" label="科室" width="180px" />
            <el-table-column prop="doctor" label="医生" width="150px"/>
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
    <el-dialog v-model="addMedicalRecordDialog" title="添加就诊记录" width="300" align-center center>
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
                <el-input v-model="medicalRecordForAdd.hospital" style="width: 180px;" />
            </el-form-item>
            <el-form-item label="就诊科室">
                <el-input v-model="medicalRecordForAdd.department" style="width: 180px;" />
            </el-form-item>
            <el-form-item label="诊断医师">
                <el-input v-model="medicalRecordForAdd.doctor" style="width: 180px;" />
            </el-form-item>
            <el-form-item label="诊断结果">
                <el-input v-model="medicalRecordForAdd.diagnosticResult" type="textarea" autosize
                    style="width: 180px;" />
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addMedicalRecordDialog = false">取消</el-button>
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
