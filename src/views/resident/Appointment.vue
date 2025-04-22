<script setup>
import { addAppointmentService, cancelAppointmentService, getAppointmentService } from '@/api/appointment';
import { getDepartmentService } from '@/api/department';
import { getDoctorService } from '@/api/doctor';
import { getHospitalService } from '@/api/hospital';
import { getScheduleService } from '@/api/schedule';
import { ElMessage } from 'element-plus';
import { ref, onBeforeMount } from 'vue';
const addAppointmentDialog = ref(false)
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
const appointment = ref({})
const appointmentForAdd = ref({})
//新增预约时所需的查询的量
const hospitals = ref([])
const departments = ref([])
const doctors = ref([])
const schedules = ref([])
//查询预约
const getAppointment = async () => {
    let result = await getAppointmentService(pageQueryDto.value);
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
//查询医院信息
const getHospital = async () => {
    addAppointmentDialog.value = true;
    hospitals.value = (await getHospitalService()).data;
}
//医院选择框更改
const hospitalChange = async () => {
    //根据医院id询科室信息
    let result = await getDepartmentService(appointmentForAdd.value.hospitalId);
    departments.value = result.data;
    //如果已经选择科室，则清空
    appointmentForAdd.value.departmentId = null;
}
//科室选择框更改
const departmentChange = async () => {
    //根据科室id查询医生
    let result = await getDoctorService(appointmentForAdd.value.departmentId);
    doctors.value = result.data;
    appointmentForAdd.value.doctorId = null;

}
//医生选择框更改
const doctorChange = async () => {
    //根据医生id查询时间段
    let result = await getScheduleService(appointmentForAdd.value.doctorId);
    schedules.value = result.data;
    appointmentForAdd.value.scheduleId = null;
    //处理日期格式
    schedules.value.forEach(item => {
        item.startTime = item.startTime.replace("T", " ")
        item.endTime = item.endTime.replace("T", " ")
    })
}
//新增预约
const addAppointment = async () => {
    if (!appointmentForAdd.value.hospitalId || !appointmentForAdd.value.departmentId ||
        !appointmentForAdd.value.doctorId || !appointmentForAdd.value.scheduleId) {
        ElMessage.error("请确保信息完整")
    } else {
        let result = await addAppointmentService(appointmentForAdd.value);
        if (result.code == 1) {
            ElMessage.success("预约成功")
            await getAppointment();
        } else {
            ElMessage.error(result.msg);
        }
        addAppointmentDialog.value = false;
    }

}
onBeforeMount(async () => {
    await getAppointment();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>我的预约</h4>
            <el-button type="success" @click="getHospital()">新增预约</el-button>
        </div>
        <el-table :data="appointment.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
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
                    <el-button link type="warning" size="small" @click="cancelAppointment(scope.row)">
                        取消预约
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="appointment.total" @current-change="pageChange" />
        </div>
    </el-card>
    <!-- 添加预约-->
    <el-dialog v-model="addAppointmentDialog" title="新增预约" width="480" align-center center>
        <el-form class="form-update form-basic-info" label-width="70px" label-position="left">
            <el-form-item label="医院">
                <el-select v-model="appointmentForAdd.hospitalId" style="width: 360px" placeholder="选择"
                    @change="hospitalChange()">
                    <el-option v-for="item in hospitals" :key="item.id" :value="item.id" :label="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="科室">
                <el-select v-model="appointmentForAdd.departmentId" style="width: 360px" placeholder="选择"
                    @change="departmentChange()" :disabled="!appointmentForAdd.hospitalId">
                    <el-option v-for="item in departments" :key="item.id" :value="item.id" :label="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="医生">
                <el-select v-model="appointmentForAdd.doctorId" style="width: 360px" placeholder="选择"
                    @change="doctorChange()" :disabled="!appointmentForAdd.departmentId">
                    <el-option v-for="item in doctors" :key="item.id" :value="item.id" :label="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="时间">
                <el-select v-model="appointmentForAdd.scheduleId" style="width: 360px" placeholder="选择"
                    :disabled="!appointmentForAdd.doctorId">
                    <el-option v-for="item in schedules" :key="item.id" :value="item.id"
                        :label="`${item.startTime} ~ ${item.endTime}${item.capacity && item.reservedCount >= item.capacity ? ' 已满' : ''}`"
                        :disabled="item.capacity != 0 && item.capacity <= item.reservedCount" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addAppointmentDialog = false">取消</el-button>
                <el-button type="primary" @click="addAppointment">
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

.el-pagination {
    margin: 0 auto;
}
</style>
