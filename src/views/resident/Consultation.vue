<script setup>
import { addConsultationService, deleteConsultationService, getConsultationService } from '@/api/consultation';
import { ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'
//上传图片时可用的格式
const imgType = ['image/jpeg', 'image/png', 'image/webp']
const consultationReplyDialog = ref(false)
const addConsultationDialog = ref(false)
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 3
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
    addConsultationDialog.value = false;
    ElMessage.success("发布成功");
    await getConsultation();
}
//图片上传相关
const handleImgSuccess = (result, uploadFile) => {
    consultationForAdd.value.url = result.data;
}
const beforeImgUpload = (rawFile) => {
    if (!imgType.includes(rawFile.type)) {
        ElMessage.error('图片格式不支持')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片不能大于2MB')
        return false
    }
    return true;
}
const handleImgRemove = () => {

}
onBeforeMount(async () => {
    await getConsultation();
})
</script>

<template>
    <el-scrollbar height="670px">
        <el-card>
            <div class="option">
                <h4>我的咨询</h4>
                <el-button plain type="success" @click="addConsultationDialog = true">发起咨询</el-button>
            </div>
            <el-table :data="consultation.items" border style="width: 100%" stripe>
                <el-table-column type="index" width="60" label="序号" />
                <el-table-column prop="title" label="标题" width="200px" />
                <el-table-column prop="content" label="咨询内容" />
                <el-table-column label="图片" width="225px">
                    <template #default="scope">
                        <el-image :src="scope.row.url" :preview-src-list="[scope.row.url]" fit="contain"
                            class="img-show" hide-on-click-modal preview-teleported :z-index="9" title="点击放大显示">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发起时间" width="180px" />
                <el-table-column fixed="right" label="操作" width="120">
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
    </el-scrollbar>

    <!-- 查看回复 -->
    <el-dialog v-model="consultationReplyDialog" title="回复" width="320px" align-center center>
        <el-descriptions column="1" size="large" border>
            <el-descriptions-item label="回复医生">{{ singleConsultation.doctorName }}</el-descriptions-item>
            <el-descriptions-item label="回复内容">{{ singleConsultation.replyContent }}</el-descriptions-item>
            <el-descriptions-item label="回复时间">{{ singleConsultation.replyTime }}</el-descriptions-item>
        </el-descriptions>
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
            <el-form-item label="图片">
                <el-upload class="img-uploader" action="/api/upload" name="image" :show-file-list="false"
                    :on-success="handleImgSuccess" :before-upload="beforeImgUpload" :on-remove="handleImgRemove">
                    <img v-if="consultationForAdd.url" :src="consultationForAdd.url" class="img" />
                    <el-icon v-else class="img-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
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
.el-scrollbar {
    width: 90% !important;
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

.el-pagination {
    margin: 0 auto;
}

.img-show {
    width: 200px;
    height: 158px;
    display: block;
}

.img-uploader .img {
    width: 200px;
    height: 178px;
    display: block;
}
</style>
<style>
.img-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.img-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 178px;
    text-align: center;
}
</style>