<script setup>
import { ref, onBeforeMount } from 'vue';
import { getMedicalRecordService, deleteMedicalRecordService } from '@/api/medicalRecord';
import { ElMessage } from 'element-plus';
//诊断记录
const medicalRecord = ref({})

//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})

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
        </div>
        <el-table :data="medicalRecord.items" border style="width: 100%" stripe
            :default-sort="{ prop: 'visitTime', order: 'descending' }">
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="visitTime" label="时间" sortable width="120px" />
            <el-table-column prop="visitType" label="类型" width="60px" />
            <el-table-column prop="resident" label="居民" width="80px" />
            <el-table-column prop="hospital" label="地点" width="180px" />
            <el-table-column prop="department" label="科室" width="180px" />
            <el-table-column prop="doctor" label="医生" width="150px" />
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
