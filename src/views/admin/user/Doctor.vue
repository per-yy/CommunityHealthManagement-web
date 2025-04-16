<script setup>
import { ref, onBeforeMount } from 'vue';
import { deleteUserService, getUserInfoByDoctorIdService } from '@/api/user';
import { getDoctorListService } from '@/api/doctor';
const doctors = ref({})
const userInfo = ref({})
const doctorInfo = ref({})
const userInfoDialog = ref(false)
const deleteConfirmDialog = ref(false)
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
//查询居民列表
const getDoctorList = async () => {
    let result = await getDoctorListService(pageQueryDto.value);
    doctors.value = result.data;
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getDoctorList(pageQueryDto.value);
}
//查询账号信息
const getUserInfo = async (doctorId) => {
    let result = await getUserInfoByDoctorIdService(doctorId);
    userInfo.value = result.data;
}
//查看账号信息
const viewUserInfo = async (row) => {
    doctorInfo.value = row;
    await getUserInfo(row.id);
    userInfoDialog.value = true;
}

//删除确认
const deleteConfirm = async (row) => {
    doctorInfo.value = row;
    await getUserInfo(row.id);
    deleteConfirmDialog.value = true;
}
//删除居民所有信息
const deleteUser = async () => {
    await deleteUserService(userInfo.value.id);
    await getDoctorList(pageQueryDto.value);
    deleteConfirmDialog.value = false;
}
onBeforeMount(async () => {
    await getDoctorList();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>医生列表</h4>
        </div>
        <el-table :data="doctors.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="name" label="姓名" width="100px" />
            <el-table-column label="性别" width="100px">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="100px" />
            <el-table-column prop="hospital" label="所属医院" width="150px" />
            <el-table-column prop="department" label="所属科室" width="150px" />
            <el-table-column prop="introduction" label="简介" />
            <el-table-column label="操作" width="120px">
                <template #default="scope">
                    <el-button size="small" link type="primary" @click="viewUserInfo(scope.row)">
                        账号信息
                    </el-button>
                    <el-button size="small" link type="danger" @click="deleteConfirm(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center; margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="doctors.total" @current-change="pageChange" />
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

    <!-- 删除警告 -->
    <el-dialog v-model="deleteConfirmDialog" title="确定要删除吗" width="300px" align-center center>
        删除医生会一并删除账号信息
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
