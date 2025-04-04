<script setup>
import { addConsultationService, deleteConsultationService, getConsultationService } from '@/api/consultation';
import { ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue';

const consultationReplyDialog = ref(false)
const addConsultationDialog = ref(false)
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 11
})
const consultation = ref({});
//回复的信息
const singleConsultation = ref({})
//用于新增的咨询
const consultationForAdd = ref({})
//查询咨询
const getConsultation = async () => {
    let result = await getConsultationService(pageQueryDto.value);
    consultation.value = result.data;
    //处理日期格式
    consultation.value.items.forEach(item => {
        item.createTime = item.createTime.replace("T", " ")
        item.replyTime = item.replyTime.replace("T", " ")
    })
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getConsultation();
}

//显示咨询回复信息
const showReply = (row) => {
    consultationReplyDialog.value = true;
    singleConsultation.value = row
}

//删除咨询
const deleteConsultation = async (row) => {
    await deleteConsultationService(row.id);
    ElMessage.success("删除成功");
    await getConsultation();
}

//发起咨询
const addConsultation = async () => {
    await addConsultationService(consultationForAdd.value);
    addConsultationDialog.value=false;
    ElMessage.success("发布成功");
    await getConsultation();
}

onBeforeMount(async () => {
    await getConsultation();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>我的咨询</h4>
            <el-button plain type="success" @click="addConsultationDialog = true">发起咨询</el-button>
        </div>
        <el-table :data="consultation.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="title" label="标题" width="200px" />
            <el-table-column prop="content" label="咨询内容" />
            <el-table-column prop="createTime" label="发起时间" width="180px" />
            <el-table-column fixed="right" label="操作" width="130">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="showReply(scope.row)"
                        :disabled="scope.row.isReply == 0">
                        {{ scope.row.isReply == 1 ? '查看回复' : '等待回复' }}
                    </el-button>
                    <el-button size="small" link type="danger" @click="deleteConsultation(scope.row)">
                        删除
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
        <div class="reply-content">
            <span>回复医生：</span>
            <span>{{ singleConsultation.doctorName }}</span>
        </div>
        <div class="reply-content">
            <span>回复内容：</span>
            <span>{{ singleConsultation.replyContent }}</span>
        </div>
        <div class="reply-content">
            <span>回复时间：</span>
            <span>{{ singleConsultation.replyTime }}</span>
        </div>
    </el-dialog>
    <!-- 新增咨询 -->
    <el-dialog v-model="addConsultationDialog" title="发起咨询" width="300" align-center center>
        <el-form label-width="50px" label-position="left">
            <el-form-item label="标题">
                <el-input v-model="consultationForAdd.title" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="内容">
                <el-input v-model="consultationForAdd.content" style="width: 200px;" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addConsultationDialog = false">取消</el-button>
                <el-button type="primary" @click="addConsultation">
                    发布
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

.reply-content div {
    font-size: medium;
    padding: 5px;
}
</style>
