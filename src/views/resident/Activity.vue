<script setup>
import { ref, onBeforeMount } from 'vue';
import { getActivityService, joinActivityService } from '@/api/activity';
import { ElMessage } from 'element-plus';
const showDetailDialog = ref(false)
//查看活动详情时所需的单个活动
const singleActivity = ref({})
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 11
})
const activity = ref({});
//查询活动
const getActivity = async () => {
    let result = await getActivityService(pageQueryDto.value);
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
    await getActivity();
}
//显示详情
const showDetail = (row) => {
    singleActivity.value = row;
    showDetailDialog.value = true;
}
//报名活动
const joinActivity = () => {
    joinActivityService(singleActivity.value.id);
    singleActivity.value.isJoined = 1;
    singleActivity.value.registered += 1;
    showDetailDialog.value = false;
    ElMessage.success("报名成功")
}
onBeforeMount(async () => {
    await getActivity();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>社区活动</h4>
        </div>
        <el-table :data="activity.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="type" label="活动类型" width="120px" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="startTime" label="开始时间" width="165px" />
            <el-table-column prop="endTime" label="结束时间" width="165px" />
            <el-table-column label="名额上限" width="85px">
                <template #default="scope">
                    {{ scope.row.capacity == 0 ? '不限' : `${scope.row.capacity}` }}
                </template>
            </el-table-column>
            <el-table-column prop="registered" label="已报人数" width="85px" />
            <el-table-column fixed="right" label="状态" width="80">
                <template #default="scope">
                    <el-button link
                        :type="scope.row.isJoined == 1 ? 'success' : (scope.row.capacity == 0 ? 'primary' : (scope.row.capacity > scope.row.registered ? 'primary' : 'danger'))"
                        size="small" @click="showDetail(scope.row)"
                        :disabled="(scope.row.registered >= scope.row.capacity && scope.row.capacity != 0) || scope.row.isJoined == 1">
                        {{ scope.row.isJoined == 1 ? '已报' : (scope.row.capacity == 0 ? '详情' : (scope.row.capacity >
                            scope.row.registered ? '详情' : '已满'))
                        }}
                    </el-button>
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
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="joinActivity">
                    报名
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
