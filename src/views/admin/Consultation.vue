<script setup>
import { getAllConsultationService, deleteConsultationService } from '@/api/consultation';
import { ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue';
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 3
})
const consultation = ref({});

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
//删除咨询
const deleteConsultation = async (id) => {
    await deleteConsultationService(id);
    await getConsultation();
    ElMessage.success("删除成功")
}

onBeforeMount(async () => {
    await getConsultation();
})
</script>

<template>
    <el-scrollbar height="670px">
        <el-card>
            <div class="option">
                <h4>全部咨询</h4>
            </div>
            <el-table :data="consultation.items" border style="width: 100%" stripe>
                <el-table-column type="index" width="55" label="序号" />
                <el-table-column prop="residentName" width="85" label="居民" />
                <el-table-column prop="title" label="标题" width="120px" />
                <el-table-column prop="content" label="咨询内容" />
                <el-table-column label="图片" width="225px">
                    <template #default="scope">
                        <el-image :src="scope.row.url" :preview-src-list="[scope.row.url]" fit="contain"
                            class="img-show" hide-on-click-modal preview-teleported :z-index="9" title="点击放大显示">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发起时间" width="156px" />
                <el-table-column prop="doctorName" label="回复医生" width="85px" />
                <el-table-column prop="replyContent" label="回复内容" />
                <el-table-column prop="replyTime" label="回复时间" width="156" />
                <el-table-column prop="tag" label="状态" width="85">
                    <template #default="scope">
                        <el-tag :type="scope.row.isReply == 1 ? 'success' : 'warning'">{{
                            scope.row.isReply == 1 ? '已回复' : '未回复' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="55">
                    <template #default="scope">
                        <el-button link type="danger" size="small" @click="deleteConsultation(scope.row.id)">
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
</style>
