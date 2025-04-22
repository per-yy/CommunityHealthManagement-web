<script setup>
import { ref, onBeforeMount } from 'vue';
import { addActivityService, deleteActivityService, getActivityAndResidentService, getActivityService, joinActivityService } from '@/api/activity';
import { ElMessage } from 'element-plus';
const showDetailDialog = ref(false)
const addActivityDialog = ref(false)
//查看活动详情时所需的单个活动
const singleActivity = ref({})
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 11
})
const activity = ref({});
//查询活动
const getActivityAndResident = async () => {
    let result = await getActivityAndResidentService(pageQueryDto.value);
    activity.value = result.data;
    //处理日期格式
    activity.value.items.forEach(item => {
        item.startTime = item.startTime.replace("T", " ")
        item.endTime = item.endTime.replace("T", " ")
    })
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getActivityAndResident();
}
//显示详情
const showDetail = (row) => {
    singleActivity.value = row;
    showDetailDialog.value = true;
}
//发布活动
const addActivity = async () => {
    if (singleActivity.value.type == null || singleActivity.value.title == null ||
        singleActivity.value.description == null || singleActivity.value.location == null ||
        singleActivity.value.organizer == null || singleActivity.value.capacity == null ||
        singleActivity.value.startTime == null || singleActivity.value.endTime == null ||
        singleActivity.value.type == '' || singleActivity.value.title == '' ||
        singleActivity.value.description == '' || singleActivity.value.location == '' ||
        singleActivity.value.organizer == '' || singleActivity.value.capacity == '') {
        ElMessage.error("请确保信息完整")
    } else {
        await addActivityService(singleActivity.value);
        await getActivityAndResident(pageQueryDto);
        ElMessage.success("发布成功")
        addActivityDialog.value = false;
    }
}
//删除活动
const deleteActivity = async (id) => {
    await deleteActivityService(id);
    await getActivityAndResident(pageQueryDto.value);
    ElMessage.success("删除成功")
}

onBeforeMount(async () => {
    await getActivityAndResident();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>社区活动</h4>
            <el-button type="success" @click="addActivityDialog = true; singleActivity = {}">发布活动</el-button>
        </div>
        <el-table :data="activity.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="type" label="活动类型" width="120px" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="startTime" label="开始时间" width="165px" />
            <el-table-column prop="endTime" label="结束时间" width="165px" />
            <el-table-column prop="capacity" label="名额上限" width="85px">
                <template #default="scope">
                    {{ scope.row.capacity == 0 ? '不限' : `${scope.row.capacity}` }}
                </template>
            </el-table-column>
            <el-table-column prop="registered" label="已报人数" width="85px" />
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="showDetail(scope.row)">
                        详情
                    </el-button>
                    <el-button link type="danger" size="small" @click="deleteActivity(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="tag" label="状态" width="70">
                <template #default="scope">
                    <el-tag
                        :type="scope.row.capacity == 0 ? 'success' : (scope.row.capacity > scope.row.registered ? 'success' : 'warning')">{{
                            scope.row.capacity == 0 ? '未满' : (scope.row.capacity > scope.row.registered ? '未满' : '已满')
                        }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column type="expand" label="名单" width="60">
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
                :total="activity.total" @current-change="pageChange" />
        </div>
    </el-card>
    <!-- 查看详情 -->
    <el-dialog v-model="showDetailDialog" title="活动详情" width="500px" align-center center>
        <el-descriptions column="1" size="large" border label-width="90px">
            <el-descriptions-item label="主办方">{{ singleActivity.organizer }}</el-descriptions-item>
            <el-descriptions-item label="地点">{{ singleActivity.location }}</el-descriptions-item>
            <el-descriptions-item label="详情">{{ singleActivity.description }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <!-- 发布活动-->
    <el-dialog v-model="addActivityDialog" title="发布活动" width="420" align-center center>
        <el-form label-width="90px" label-position="left">
            <el-form-item label="类型">
                <el-input v-model="singleActivity.type"></el-input>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="singleActivity.title"></el-input>
            </el-form-item>
            <el-form-item label="详情">
                <el-input v-model="singleActivity.description" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="地点">
                <el-input v-model="singleActivity.location"></el-input>
            </el-form-item>
            <el-form-item label="主办方">
                <el-input v-model="singleActivity.organizer"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="singleActivity.startTime" value-format="YYYY-MM-DDTHH:mm:ss" type="datetime"
                    placeholder="选择" style="width: 298px;" />
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="singleActivity.endTime" value-format="YYYY-MM-DDTHH:mm:ss" type="datetime"
                    placeholder="选择" style="width: 298px;" />
            </el-form-item>
            <el-form-item label="名额上限">
                <el-input v-model="singleActivity.capacity" placeholder="输入0代表人数无限制" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addActivityDialog = false">取消</el-button>
                <el-button type="primary" @click="addActivity">
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
