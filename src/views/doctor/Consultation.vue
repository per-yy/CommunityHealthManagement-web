<script setup>
import { getAllConsultationService, replyConsultationService } from '@/api/consultation';
import { ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue';
//回复居民的对话框
const replyConsultationDialog = ref(false)
//查看回复的对话框
const consultationReplyDialog = ref(false)
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 3
})
const consultation = ref({});
//回复的信息
const singleConsultation = ref({})
//查询咨询
const getConsultation = async () => {
    let result = await getAllConsultationService(pageQueryDto.value);
    consultation.value = result.data;
    //处理日期格式
    consultation.value.items.forEach(item => {
        item.createTime = item.createTime.replace("T", " ")
        if (item.replyTime) {
            item.replyTime = item.replyTime.replace("T", " ")
        }
    })
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getConsultation();
}

//打开 回复或查看回复 对话框
const operate = (row) => {
    singleConsultation.value = row
    if (row.isReply == 1) {
        consultationReplyDialog.value = true;
    } else {
        //因为前端修改了时间格式，如果传到后端会报错 测试时数据库中的replyTime有时间，所以也要修改
        singleConsultation.value.createTime = null;
        singleConsultation.value.replyTime = null;
        replyConsultationDialog.value = true;
    }
}
//回复
const replyConsultation = async () => {
    replyConsultationService(singleConsultation.value);
    ElMessage.success("回复成功")
    singleConsultation.value.isReply = 1;
    replyConsultationDialog.value = false;
}

onBeforeMount(async () => {
    await getConsultation();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>全部咨询</h4>
        </div>
        <el-table :data="consultation.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="residentName" width="100" label="居民" />
            <el-table-column prop="title" label="标题" width="200px" />
            <el-table-column prop="content" label="咨询内容" />
            <el-table-column label="图片" width="225px">
                <template #default="scope">
                    <el-image :src="scope.row.url" :preview-src-list="[scope.row.url]" fit="contain" class="img-show"
                        hide-on-click-modal preview-teleported :z-index="9" title="点击放大显示">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="发起时间" width="180px" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link :type="scope.row.isReply == 1 ? 'success' : 'primary'" size="small"
                        @click="operate(scope.row)">
                        {{ scope.row.isReply == 1 ? '查看回复' : '回复' }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="consultation.total" @current-change="pageChange" />
        </div>
    </el-card>
    <!-- 查看回复 -->
    <el-dialog v-model="consultationReplyDialog" title="回复" width="320px" align-center center>
        <el-descriptions column="1" size="large" border>
            <el-descriptions-item label="回复医生">{{ singleConsultation.doctorName }}</el-descriptions-item>
            <el-descriptions-item label="回复内容">{{ singleConsultation.replyContent }}</el-descriptions-item>
            <el-descriptions-item label="回复时间">{{ singleConsultation.replyTime }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <!-- 回复 -->
    <el-dialog v-model="replyConsultationDialog" title="回复" width="300" align-center center>
        <el-form label-width="50px" label-position="left">
            <el-form-item label="内容">
                <el-input v-model="singleConsultation.replyContent" style="width: 200px;" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="replyConsultationDialog = false">取消</el-button>
                <el-button type="primary" @click="replyConsultation">
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

.img-show {
    width: 200px;
    height: 158px;
    display: block;
}
</style>
