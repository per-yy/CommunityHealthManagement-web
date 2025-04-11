<script setup>
import { onBeforeMount, ref } from 'vue';
import { getUserInfoService, updateUserInfoService } from '@/api/user';
import { ElMessage } from 'element-plus';
import { getDoctorSelfInfoService, updateDoctorInfoService } from '@/api/doctor';
const updateUserInfoDialog = ref(false)
const updateDoctorInfoDialog = ref(false)
//用户账号信息
const user = ref({})
//医生基本信息
const doctorInfo = ref({});
//性别
const genderList = ref([
    { value: 1, label: '男' },
    { value: 0, label: "女" }
])
//查询用户账号信息
const getUserInfo = async () => {
    let result = await getUserInfoService();
    user.value = result.data;
}
//查询医生基本信息
const getDoctorInfo = async () => {
    let result = await getDoctorSelfInfoService();
    doctorInfo.value = result.data;
}
//修改账号信息
const updateUserInfo = () => {
    if (user.value.username != '' && user.value.phone != null) {
        updateUserInfoDialog.value = false;
        updateUserInfoService(user.value);
        ElMessage.success("修改成功")
    }
}
//修改医生基础信息
const updateDoctorInfo = () => {
    if (doctorInfo.value.name != '' && doctorInfo.value.age > 0 && doctorInfo.value.introduction != '') {
        updateDoctorInfoDialog.value = false;
        updateDoctorInfoService(doctorInfo.value);
        ElMessage.success("修改成功")
    }
}
onBeforeMount(async () => {
    //查询用户账号信息
    await getUserInfo();
    //查询居民基础信息
    await getDoctorInfo();

})
</script>

<template>
    <el-card>
        <el-descriptions title="账号信息" direction="vertical" border :size="'large'" column="3">
            <template #extra>
                <el-button type="info" plain @click="updateUserInfoDialog = true">编辑</el-button>
            </template>
            <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ user.phone }}</el-descriptions-item>
        </el-descriptions>
        <el-divider />

        <el-descriptions title="基础信息" direction="vertical" border :size="'large'" column="3">
            <template #extra>
                <el-button type="info" plain @click="updateDoctorInfoDialog = true">编辑</el-button>
            </template>
            <el-descriptions-item label="姓名">{{ doctorInfo.name == null ? '暂无' : doctorInfo.name
                }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ doctorInfo.gender == 1 ? '男' : (doctorInfo.gender == 0 ? '女' :
                '暂无')
                }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ doctorInfo.age == 0 ? '暂无' : doctorInfo.age
                }}</el-descriptions-item>
            <el-descriptions-item label="所属医院">{{ doctorInfo.hospital == null ? '暂无' : doctorInfo.hospital
                }}</el-descriptions-item>
            <el-descriptions-item label="所属科室">{{ doctorInfo.department == null ? '暂无' : doctorInfo.department
                }}</el-descriptions-item>
            <el-descriptions-item label="简介">{{ doctorInfo.introduction == null ? '暂无' : doctorInfo.introduction
                }}</el-descriptions-item>
        </el-descriptions>
    </el-card>
    <!-- 修改账号信息 -->
    <el-dialog v-model="updateUserInfoDialog" title="修改账号信息" width="270" align-center center>
        <el-form class="form-update form-basic-info" label-width="60px" label-position="left">
            <el-form-item label="用户名">
                <el-input v-model="user.username" />
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="user.phone" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="updateUserInfoDialog = false">取消</el-button>
                <el-button type="primary" @click="updateUserInfo">
                    修改
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 修改医生信息 -->
    <el-dialog v-model="updateDoctorInfoDialog" title="修改基础信息" width="280" align-center center>
        <el-form class="form-update form-basic-info" label-width="70px" label-position="left">
            <el-form-item label="姓名">
                <el-input v-model="doctorInfo.name" />
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="doctorInfo.gender" style="width: 180px">
                    <el-option v-for="item in genderList" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="年龄">
                <el-input v-model="doctorInfo.age" />
            </el-form-item>
            <el-form-item label="简介">
                <el-input v-model="doctorInfo.introduction" type="textarea" autosize style="width: 180px;" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="updateDoctorInfoDialog = false">取消</el-button>
                <el-button type="primary" @click="updateDoctorInfo">
                    修改
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

.form-update .el-form-item {
    margin-right: 0;
}

.form-update .item-right {
    margin-left: 44px;
}


.form-update .el-input {
    --el-input-width: 120px;
}

.form-basic-info .el-input {
    --el-input-width: 180px;
}
</style>
