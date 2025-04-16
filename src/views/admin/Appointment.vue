<script setup>
import { cancelAppointmentService, getAllAppointmentService } from '@/api/appointment';
import { ElMessage } from 'element-plus';
import { ref, onBeforeMount } from 'vue';

//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
const appointment = ref({})


//查询预约
const getAppointment = async () => {
    let result = await getAllAppointmentService(pageQueryDto.value);
    appointment.value = result.data;
    //处理日期格式
    appointment.value.items.forEach(item => {
        item.startTime = item.startTime.replace("T", " ")
        item.endTime = item.endTime.replace("T", " ")
    })
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getAppointment();
}
//取消预约
const cancelAppointment = async (row) => {
    await cancelAppointmentService(row);
    ElMessage.success("取消成功")
    await getAppointment();
}

onBeforeMount(async () => {
    await getAppointment();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>预约记录</h4>
        </div>
        <el-table :data="appointment.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="resident" label="居民" width="150px" />
            <el-table-column prop="hospital" label="医院" width="150px" />
            <el-table-column prop="department" label="科室" />
            <el-table-column prop="doctor" label="医生  " />
            <el-table-column label="时间段" width="360px">
                <template #default="scope">
                    {{ scope.row.startTime }} ~ {{ scope.row.endTime }}
                </template>
            </el-table-column>
            <el-table-column width="1px" />
            <el-table-column fixed="right" label="操作" width="90">
                <template #default="scope">
                    <el-button link type="danger" size="small" @click="cancelAppointment(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="appointment.total" @current-change="pageChange" />
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

.el-pagination {
    margin: 0 auto;
}
</style>
