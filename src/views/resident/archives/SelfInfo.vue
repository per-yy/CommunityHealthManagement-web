<script setup>
import { onBeforeMount, ref } from 'vue';
import { getResidentInfoService, updateResidentInfoService } from '@/api/resident';
import { updateHealthInfoService, getHealthInfoService } from '@/api/healthInfo';
import { getUserInfoService, updateUserInfoService } from '@/api/user';
import { ElMessage } from 'element-plus';

//用户账号信息
const user = ref({})
//居民基本信息
const residentInfo = ref({});
//居民健康信息
const healthInfo = ref({});

//性别
const genderList = ref([
    { value: 1, label: '男' },
    { value: 0, label: "女" }
])

//血型
const bloodTypeList = ref(['A', 'B', 'AB', 'O', 'RH阴性', 'RH阳性'])

//修改账号信息对话框
const updateUserInfoDialog = ref(false)
//修改居民信息对话框
const updateResidentInfoDialog = ref(false)
//修改健康信息对话框
const updateHealthInfoDialog = ref(false)

// 计算属性实现BMI自动更新
const calculateBMI = () => {
    if (healthInfo.value.height > 0 && healthInfo.value.weight > 0) {
        const heightInMeters = healthInfo.value.height / 100
        healthInfo.value.bmi = (
            healthInfo.value.weight / (heightInMeters * heightInMeters)
        ).toFixed(2)
    } else {
        healthInfo.value.bmi = ''
    }
}

//查询用户账号信息
const getUserInfo = async () => {
    let result = await getUserInfoService();
    user.value = result.data;
}
//查询居民基本信息
const getResidentInfo = async () => {
    let result = await getResidentInfoService();
    residentInfo.value = result.data;
}
//查询居民健康信息
const getHealthInfo = async () => {
    let result = await getHealthInfoService();
    healthInfo.value = result.data;
}

//修改账号信息
const updateUserInfo = () => {
    if (user.value.username != '' && user.value.phone != null) {
        updateUserInfoDialog.value = false;
        updateUserInfoService(user.value);
        ElMessage.success("修改成功")
    }
}
//修改居民基础信息
const updateResidentInfo = () => {
    if (residentInfo.value.name != '' && residentInfo.value.age > 0 && residentInfo.value.address != '') {
        updateResidentInfoDialog.value = false;
        updateResidentInfoService(residentInfo.value);
        ElMessage.success("修改成功")
    }
}
//修改居民健康信息
const updateHealthInfo = () => {
    if (healthInfo.value.height > 0 && healthInfo.value.weight > 0 && healthInfo.value.heartRate > 0 &&
        healthInfo.value.bloodPressureHigh > 0 && healthInfo.value.bloodPressureLow > 0 && healthInfo.value.bloodFat > 0 && healthInfo.value.bloodGlucose > 0) {
        updateHealthInfoDialog.value = false;
        updateHealthInfoService(healthInfo.value);
        ElMessage.success("修改成功")
    } else {
        ElMessage.error("请确保输入正确")
    }

}
onBeforeMount(async () => {
    //查询用户账号信息
    await getUserInfo();
    //查询居民基础信息
    await getResidentInfo();
    //查询居民健康信息
    await getHealthInfo();
})
</script>

<template>
    <el-scrollbar height="650px">
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
                    <el-button type="info" plain @click="updateResidentInfoDialog = true">编辑</el-button>
                </template>
                <el-descriptions-item label="姓名">{{ residentInfo.name == null ? '暂无' : residentInfo.name
                    }}</el-descriptions-item>
                <el-descriptions-item label="身份证号">{{ residentInfo.idNumber == null ? '暂无' : residentInfo.idNumber
                    }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ residentInfo.gender == 1 ? '男' : (residentInfo.gender == 0 ? '女' :
                    '暂无')
                }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{ residentInfo.age == 0 ? '暂无' : residentInfo.age
                    }}</el-descriptions-item>
                <el-descriptions-item label="家庭住址">{{ residentInfo.address == null ? '暂无' : residentInfo.address
                    }}</el-descriptions-item>
            </el-descriptions>
            <el-divider />

            <el-descriptions title="健康信息" direction="vertical" border :size="'large'" column="4"
                style="margin-top: 30px;">
                <template #extra>
                    <el-button type="info" plain @click="updateHealthInfoDialog = true">编辑</el-button>
                </template>
                <el-descriptions-item label="身高(CM)">{{ healthInfo.height == 0 ? '暂无' : healthInfo.height
                }}</el-descriptions-item>
                <el-descriptions-item label="体重(KG)">{{ healthInfo.weight == 0 ? '暂无' : healthInfo.weight
                }}</el-descriptions-item>
                <el-descriptions-item label="BMI">
                    <span>{{ healthInfo.bmi == 0 ? '暂无' : healthInfo.bmi }}</span>
                    <el-tag type="warning" v-if="healthInfo.bmi && healthInfo.bmi < 18">偏瘦</el-tag>
                    <el-tag type="success"
                        v-if="healthInfo.bmi && healthInfo.bmi >= 18 && healthInfo.bmi <= 24">正常</el-tag>
                    <el-tag type="danger" v-if="healthInfo.bmi && healthInfo.bmi > 24">偏胖</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="心率(bpm)"><span>{{ healthInfo.heartRate == 0 ? '暂无' :
                    healthInfo.heartRate }}</span>
                    <el-tag type="warning" v-if="healthInfo.heartRate && healthInfo.heartRate < 60">偏低</el-tag>
                    <el-tag type="success"
                        v-if="healthInfo.heartRate && healthInfo.heartRate >= 60 && healthInfo.heartRate <= 100">正常</el-tag>
                    <el-tag type="danger" v-if="healthInfo.heartRate && healthInfo.heartRate > 100">偏高</el-tag>
                </el-descriptions-item>

                <el-descriptions-item label="收缩压(mmHg)">
                    <span>
                        {{ healthInfo.bloodPressureHigh == 0 ? '暂无' : healthInfo.bloodPressureHigh }}
                    </span>
                    <el-tag type="warning"
                        v-if="healthInfo.bloodPressureHigh && healthInfo.bloodPressureHigh < 90">偏低</el-tag>
                    <el-tag type="success"
                        v-if="healthInfo.bloodPressureHigh && healthInfo.bloodPressureHigh >= 90 && healthInfo.bloodPressureHigh <= 139">正常</el-tag>
                    <el-tag type="danger"
                        v-if="healthInfo.bloodPressureHigh && healthInfo.bloodPressureHigh > 139">偏高</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="舒张压(mmHg)">
                    <span>
                        {{ healthInfo.bloodPressureLow == 0 ? '暂无' : healthInfo.bloodPressureLow }}
                    </span>
                    <el-tag type="warning"
                        v-if="healthInfo.bloodPressureLow && healthInfo.bloodPressureLow < 60">偏低</el-tag>
                    <el-tag type="success"
                        v-if="healthInfo.bloodPressureLow && healthInfo.bloodPressureLow >= 60 && healthInfo.bloodPressureLow <= 89">正常</el-tag>
                    <el-tag type="danger"
                        v-if="healthInfo.bloodPressureLow && healthInfo.bloodPressureLow > 89">偏高</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="血脂(mmol/L)">
                    <span>{{ healthInfo.bloodFat == 0 ? '暂无' : healthInfo.bloodFat }}</span>
                    <el-tag type="success" v-if="healthInfo.bloodFat && healthInfo.bloodFat <= 5.2">正常</el-tag>
                    <el-tag type="danger" v-if="healthInfo.bloodFat && healthInfo.bloodFat > 5.2">偏高</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="血糖(mmol/L)">
                    <span>{{ healthInfo.bloodGlucose == 0 ? '暂无' : healthInfo.bloodGlucose }}</span>
                    <el-tag type="warning" v-if="healthInfo.bloodGlucose && healthInfo.bloodGlucose < 3.9">偏低</el-tag>
                    <el-tag type="success"
                        v-if="healthInfo.bloodGlucose && healthInfo.bloodGlucose >= 3.9 && healthInfo.bloodGlucose <= 6.1">正常</el-tag>
                    <el-tag type="danger" v-if="healthInfo.bloodGlucose && healthInfo.bloodGlucose > 6.1">偏高</el-tag>
                </el-descriptions-item>

                <el-descriptions-item label="血型">{{ healthInfo.bloodType == null ? '暂无' : healthInfo.bloodType
                }}</el-descriptions-item>
                <el-descriptions-item label="病史">{{ healthInfo.medicalHistory == null ? '暂无' : healthInfo.medicalHistory
                }}</el-descriptions-item>
            </el-descriptions>
        </el-card>
    </el-scrollbar>

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

    <!-- 修改居民信息 -->
    <el-dialog v-model="updateResidentInfoDialog" title="修改基础信息" width="280" align-center center>
        <el-form class="form-update form-basic-info" label-width="70px" label-position="left">
            <el-form-item label="姓名">
                <el-input v-model="residentInfo.name" />
            </el-form-item>
            <el-form-item label="身份证号">
                <el-input v-model="residentInfo.idNumber" />
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="residentInfo.gender" style="width: 180px">
                    <el-option v-for="item in genderList" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="年龄">
                <el-input v-model="residentInfo.age" />
            </el-form-item>
            <el-form-item label="家庭住址">
                <el-input v-model="residentInfo.address" type="textarea" autosize style="width: 180px;" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="updateResidentInfoDialog = false">取消</el-button>
                <el-button type="primary" @click="updateResidentInfo">
                    修改
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 修改健康信息 -->
    <el-dialog v-model="updateHealthInfoDialog" title="修改健康信息" width="600" align-center center>
        <el-form :inline="true" :model="healthInfo" class="form-update" label-width="120px" label-position="left">
            <el-form-item label="身高(CM)">
                <el-input v-model="healthInfo.height" @input="calculateBMI" />
            </el-form-item>
            <el-form-item label="体重(KG)" class="item-right">
                <el-input v-model="healthInfo.weight" @input="calculateBMI" />
            </el-form-item>
            <el-form-item label="BMI">
                <el-input :model-value="healthInfo.bmi" disabled />
            </el-form-item>
            <el-form-item label="心率(bpm)" class="item-right">
                <el-input v-model="healthInfo.heartRate" placeholder="心率(bpm)" />
            </el-form-item>

            <el-form-item label="收缩压(mmHg)">
                <el-input v-model="healthInfo.bloodPressureHigh" />
            </el-form-item>
            <el-form-item label="舒张压(mmHg)" class="item-right">
                <el-input v-model="healthInfo.bloodPressureLow" />
            </el-form-item>
            <el-form-item label="血脂(mmol/L)">
                <el-input v-model="healthInfo.bloodFat" />
            </el-form-item>
            <el-form-item label="血糖(mmol/L)" class="item-right">
                <el-input v-model="healthInfo.bloodGlucose" />

            </el-form-item>
            <el-form-item label="血型">
                <el-select v-model="healthInfo.bloodType" style="width: 120px">
                    <el-option v-for="item in bloodTypeList" :key="item" :value="item" />
                </el-select>
            </el-form-item>
        </el-form>
        <span>病史</span>
        <el-input v-model="healthInfo.medicalHistory" :autosize="{ minRows: 3, maxRows: 5 }" type="textarea"
            placeholder="病史" />
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="updateHealthInfoDialog = false">取消</el-button>
                <el-button type="primary" @click="updateHealthInfo">
                    修改
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<style scoped>
.el-scrollbar {
    width: 89% !important;
}

.el-card {
    width: 98% !important;
    margin: 15px auto;
}

.form-update .el-form-item {
    margin-right: 20px;
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
