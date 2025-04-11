<script setup>
import { addScheduleService, deleteScheduleService, getScheduleAndResidentService } from '@/api/schedule';
import { ElMessage } from 'element-plus';
import { ref, onBeforeMount } from 'vue';
const addScheduleDialog = ref(false)
const deleteScheduleDialog = ref(false)
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})

const schedules = ref({})
const scheduleForAdd = ref({})
const scheduleIdForDelete = ref(0)
//查询预约
const getScheduleAndResident = async () => {
    let result = await getScheduleAndResidentService(pageQueryDto.value);
    schedules.value = result.data;
    //处理日期格式
    schedules.value.items.forEach(item => {
        item.startTime = item.startTime.replace("T", " ")
        item.endTime = item.endTime.replace("T", " ")
    })
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getScheduleAndResident();
}
//添加可预约时间段
const addSchedule = async () => {
    if (scheduleForAdd.value.startTime == null || scheduleForAdd.value.endTime == null ||
        scheduleForAdd.value.capacity == null || scheduleForAdd.value.capacity == '') {
        ElMessage.error("请确保输入完整");
    } else {
        await addScheduleService(scheduleForAdd.value);
        ElMessage.success("添加成功")
        await getScheduleAndResident(pageQueryDto.value);
        addScheduleDialog.value = false;
    }
}
//删除时段
const deleteSchedule = async () => {
    await deleteScheduleService(scheduleIdForDelete.value);
    ElMessage.success("删除成功")
    await getScheduleAndResident(pageQueryDto.value);
    deleteScheduleDialog.value = false;
}

onBeforeMount(async () => {
    await getScheduleAndResident();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>我的预约</h4>
            <el-button type="success" @click="addScheduleDialog = true">新增时段</el-button>
        </div>
        <el-table :data="schedules.items" style="width: 100%">
            <el-table-column label="序号" type="index" width="90" />
            <el-table-column label="开始时间" prop="startTime" />
            <el-table-column label="结束时间" prop="endTime" />
            <el-table-column label="可预约人数">
                <template v-slot="scope">
                    {{ scope.row.capacity === 0 ? '不限制' : scope.row.capacity }}
                </template>
            </el-table-column>
            <el-table-column label="已预约人数" prop="reservedCount" />
            <el-table-column label="操作" width="60">
                <template #default="props">
                    <el-button type="danger" link size="small"
                        @click="scheduleIdForDelete = props.row.id; deleteScheduleDialog = true;">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column type="expand" label="展开" width="60">
                <template #default="props">
                    <el-table :data="props.row.residents" border>
                        <el-table-column label="姓名" prop="name" />
                        <el-table-column label="身份证号" prop="idNumber" />
                        <el-table-column label="性别">{{ gender == 1 ? '男' : '女' }}</el-table-column>
                        <el-table-column label="年龄" prop="age" />
                        <el-table-column label="住址" prop="address" />
                    </el-table>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="schedules.total" @current-change="pageChange" />
        </div>
    </el-card>
    <!-- 添加预约时间段-->
    <el-dialog v-model="addScheduleDialog" title="新增预约时段" width="300" align-center center>
        <el-form class="form-update form-basic-info" label-width="90px" label-position="left">
            <el-form-item label="开始时间">
                <el-date-picker v-model="scheduleForAdd.startTime" value-format="YYYY-MM-DDTHH:mm:ss" type="datetime"
                    placeholder="选择" />
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="scheduleForAdd.endTime" value-format="YYYY-MM-DDTHH:mm:ss" type="datetime"
                    placeholder="选择" />
            </el-form-item>
            <el-form-item label="可预约人数">
                <el-input v-model="scheduleForAdd.capacity" placeholder="输入0代表人数无限制" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addScheduleDialog = false">取消</el-button>
                <el-button type="primary" @click="addSchedule">
                    添加
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 确认删除时间段 -->
    <el-dialog v-model="deleteScheduleDialog" width="200" align-center center>
        确定要删除这个时段吗？
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteScheduleDialog = false">取消</el-button>
                <el-button type="primary" @click="deleteSchedule">
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
