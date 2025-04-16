<script setup>
import { ref, onBeforeMount } from 'vue';
import { getResidentListService } from '@/api/resident';
import { deleteUserService, getUserInfoByResidentIdService } from '@/api/user';
import { getHealthInfoByResidentIdService } from '@/api/healthInfo';
const residents = ref({})
const userInfo = ref({})
const residentInfo = ref({})
const healthInfo = ref({})
const userInfoDialog = ref(false)
const healthInfoDialog = ref(false)
const deleteConfirmDialog = ref(false)
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
//查询居民列表
const getResidentList = async () => {
    let result = await getResidentListService(pageQueryDto.value);
    residents.value = result.data;
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getResidentList(pageQueryDto.value);
}
//查询账号信息
const getUserInfo = async (residentId) => {
    let result = await getUserInfoByResidentIdService(residentId);
    userInfo.value = result.data;
}
//查询健康信息
const getHealthInfo = async (residentId) => {
    let result = await getHealthInfoByResidentIdService(residentId);
    healthInfo.value = result.data;
}
//查看账号信息
const viewUserInfo = async (row) => {
    residentInfo.value = row;
    await getUserInfo(row.id);
    userInfoDialog.value = true;
}
//查看健康信息
const viewHealthInfo = async (row) => {
    residentInfo.value = row;
    await getHealthInfo(row.id);
    healthInfoDialog.value = true;
}
//删除确认
const deleteConfirm = async (row) => {
    residentInfo.value = row;
    await getUserInfo(row.id);
    deleteConfirmDialog.value = true;
}
//删除居民所有信息
const deleteUser = async () => {
    await deleteUserService(userInfo.value.id);
    await getResidentList(pageQueryDto.value);
    deleteConfirmDialog.value = false;
}
onBeforeMount(async () => {
    //查询居民就诊记录
    await getResidentList();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>居民列表</h4>
        </div>
        <el-table :data="residents.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="name" label="姓名" width="120px" />
            <el-table-column prop="idNumber" label="身份证号" width="200px" />
            <el-table-column label="性别" width="150px">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="180px" />
            <el-table-column prop="address" label="住址" />
            <el-table-column label="操作" width="190px">
                <template #default="scope">
                    <el-button size="small" link type="primary" @click="viewUserInfo(scope.row)">
                        账号信息
                    </el-button>
                    <el-button size="small" link type="success" @click="viewHealthInfo(scope.row)">
                        健康信息
                    </el-button>
                    <el-button size="small" link type="danger" @click="deleteConfirm(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center; margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="residents.total" @current-change="pageChange" />
        </div>
    </el-card>
    <!-- 查看账号信息 -->
    <el-dialog v-model="userInfoDialog" title="账号信息" width="320px" align-center center>
        <el-descriptions column="1" size="large" border>
            <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ userInfo.createTime }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <!-- 查看健康信息 -->
    <el-dialog v-model="healthInfoDialog" title="健康信息" width="620px" align-center center>
        <el-descriptions direction="vertical" border :size="'large'" column="4">
            <el-descriptions-item label="身高(CM)">{{ healthInfo.height == 0 ? '暂无' : healthInfo.height
            }}</el-descriptions-item>
            <el-descriptions-item label="体重(KG)">{{ healthInfo.weight == 0 ? '暂无' : healthInfo.weight
            }}</el-descriptions-item>
            <el-descriptions-item label="BMI">{{ healthInfo.bmi == 0 ? '暂无' : healthInfo.bmi
            }}</el-descriptions-item>
            <el-descriptions-item label="心率(bpm)">{{ healthInfo.heartRate == 0 ? '暂无' : healthInfo.heartRate
            }}</el-descriptions-item>
            <el-descriptions-item label="血型">{{ healthInfo.bloodType == null ? '暂无' : healthInfo.bloodType
            }}</el-descriptions-item>
            <el-descriptions-item label="血压(mmHg)">{{ healthInfo.bloodPressure == 0 ? '暂无' :
                healthInfo.bloodPressure
            }}</el-descriptions-item>
            <el-descriptions-item label="血脂(mmol/L)">{{ healthInfo.bloodFat == 0 ? '暂无' : healthInfo.bloodFat
            }}</el-descriptions-item>
            <el-descriptions-item label="血糖(mmol/L)">{{ healthInfo.bloodGlucose == 0 ? '暂无' :
                healthInfo.bloodGlucose
            }}</el-descriptions-item>
            <el-descriptions-item label="病史">{{ healthInfo.medicalHistory == null ? '暂无' : healthInfo.medicalHistory
            }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <!-- 删除警告 -->
    <el-dialog v-model="deleteConfirmDialog" title="确定要删除吗" width="300px" align-center center>
        删除居民会一并删除账号信息和健康信息
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteConfirmDialog = false">取消</el-button>
                <el-button type="primary" @click="deleteUser">
                    确定
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

.detail {
    width: 98% !important;
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
