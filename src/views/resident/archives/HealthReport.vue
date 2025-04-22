<script setup>
import { ref,onBeforeMount } from 'vue';
import { getResidentInfoService } from '@/api/resident';
import { getHealthReportService } from '@/api/healthReport';
const healthReport = ref({});
const residentInfo = ref({});
//查询居民基本信息
const getResidentInfo = async () => {
    let result = await getResidentInfoService();
    residentInfo.value = result.data;
}
const getHealthReport = async (id) => {
    let result = await getHealthReportService(residentInfo.value.id);
    healthReport.value = result.data;
}
onBeforeMount(async () => {
    await getResidentInfo()
    await getHealthReport();
})
</script>

<template>
    <el-scrollbar height="650px">
        <el-card>
            <div class="option">
                <h4>健康报告</h4>
            </div>
            <el-divider />
            <div class="content">
                <template v-if="healthReport.content">
                <!-- 使用 v-html 渲染 HTML 字符串 -->
                <div v-html="healthReport.content"></div>
            </template>
            <template v-else>
                <!-- 无内容时显示默认文本 -->
                暂无
            </template>
            </div>
        </el-card>
    </el-scrollbar>
</template>

<style scoped>
.el-scrollbar {
    width: 89% !important;
}

.el-card {
    width: 98% !important;
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

.content {
    width: fit-content;
    margin: 0 auto;
}
</style>
