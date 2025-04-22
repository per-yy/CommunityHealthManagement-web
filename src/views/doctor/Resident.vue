<script setup>
import { ref, onBeforeMount, onBeforeUnmount, shallowRef } from 'vue';
import { getResidentListService } from '@/api/resident';
import { getHealthInfoByResidentIdService } from '@/api/healthInfo';
import { getHealthReportService, updateHealthReportService } from '@/api/healthReport'
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import {
    Back
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
//工具栏配置
const toolbarConfig = {};
//排除一些工具栏选项
toolbarConfig.excludeKeys = [
    'fullScreen',//全屏
    'group-video',//视频
    'group-image'//图片
]
// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    // console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};

//允许粘贴
const customPaste = (editor, event, callback) => {
    callback(true); // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
};

const residents = ref({})
const healthInfo = ref({})
const healthReport = ref({})
//健康报告的内容
// const content=ref('')
const healthInfoDialog = ref(false)
const pageState = ref('list')
//分页查询时的当前页和页面大小
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
//查询居民列表
const getResidentList = async () => {
    let result = await getResidentListService(pageQueryDto.value);
    residents.value = result.data;
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getResidentList(pageQueryDto.value);
}

//查询健康信息
const getHealthInfo = async (residentId) => {
    let result = await getHealthInfoByResidentIdService(residentId);
    healthInfo.value = result.data;
}

//查看健康信息
const viewHealthInfo = async (id) => {
    await getHealthInfo(id);
    healthInfoDialog.value = true;
}
//查看健康报告
const viewHealthReport = async (id) => {
    healthReport.value.residentId = id;
    let result = await getHealthReportService(id);
    healthReport.value = result.data;
    pageState.value = 'viewReport'
}
//更新报告
const updateHealthReport = () => {
    updateHealthReportService(healthReport.value);
    pageState.value = 'viewReport'
    ElMessage.success("修改成功")
}
onBeforeMount(async () => {
    //查询居民就诊记录
    await getResidentList();
})
</script>

<template>
    <el-card v-if="pageState == 'list'">
        <div class="option">
            <h4>居民列表</h4>
        </div>
        <el-table :data="residents.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="name" label="姓名" width="120px" />
            <el-table-column prop="idNumber" label="身份证号" width="200px" />
            <el-table-column label="性别" width="150px">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="180px" />
            <el-table-column prop="address" label="住址" />
            <el-table-column label="操作" width="190px">
                <template #default="scope">
                    <el-button size="small" link type="success" @click="viewHealthInfo(scope.row.id)">
                        健康信息
                    </el-button>
                    <el-button size="small" link type="primary" @click="viewHealthReport(scope.row.id)">
                        健康报告
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center; margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="residents.total" @current-change="pageChange" />
        </div>
    </el-card>
    <el-card v-else-if="pageState == 'viewReport'">
        <el-icon @click="pageState = 'list'">
            <Back />
        </el-icon>
        <div class="option">
            <h4>健康报告</h4>
            <el-button type="success" @click="pageState = 'editReport'">编辑</el-button>
        </div>
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
    <el-card v-else>
        <el-icon @click="pageState = 'viewReport'">
            <Back />
        </el-icon>
        <div class="option">
            <h4>编辑报告</h4>
            <el-button type="success" @click="updateHealthReport()">提交</el-button>
        </div>
        <div style="border: 1px solid #ccc; margin-top: 10px">
            <!-- 工具栏 -->
            <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" class="toolbar" />
            <!-- 编辑区域 -->
            <div class="report">
                <!-- 内容 -->
                <Editor :defaultConfig="editorConfig" v-model="healthReport.content" class="editor"
                    @onCreated="handleCreated" @customPaste="customPaste" />
            </div>
        </div>
    </el-card>

    <!-- 查看健康信息 -->
    <el-dialog v-model="healthInfoDialog" title="健康信息" width="620px" align-center center>
        <el-descriptions direction="vertical" border :size="'large'" column="4">
            <el-descriptions-item label="身高(CM)">{{ healthInfo.height == 0 ? '暂无' : healthInfo.height
                }}</el-descriptions-item>
            <el-descriptions-item label="体重(KG)">{{ healthInfo.weight == 0 ? '暂无' : healthInfo.weight
                }}</el-descriptions-item>
            <el-descriptions-item label="BMI">{{ healthInfo.bmi == 0 ? '暂无' : healthInfo.bmi
                }}</el-descriptions-item>
            <el-descriptions-item label="心率(bpm)">{{ healthInfo.heartRate == 0 ? '暂无' : healthInfo.heartRate
                }}</el-descriptions-item>
            <el-descriptions-item label="收缩压(mmHg)">{{ healthInfo.bloodPressureHigh == 0 ? '暂无' :
                healthInfo.bloodPressureHigh
                }}</el-descriptions-item>
            <el-descriptions-item label="舒张压(mmHg)">{{ healthInfo.bloodPressureLow == 0 ? '暂无' :
                healthInfo.bloodPressureLow
                }}</el-descriptions-item>
            <el-descriptions-item label="血脂(mmol/L)">{{ healthInfo.bloodFat == 0 ? '暂无' : healthInfo.bloodFat
                }}</el-descriptions-item>
            <el-descriptions-item label="血糖(mmol/L)">{{ healthInfo.bloodGlucose == 0 ? '暂无' :
                healthInfo.bloodGlucose
                }}</el-descriptions-item>
            <el-descriptions-item label="血型">{{ healthInfo.bloodType == null ? '暂无' : healthInfo.bloodType
                }}</el-descriptions-item>
            <el-descriptions-item label="病史">{{ healthInfo.medicalHistory == null ? '暂无' : healthInfo.medicalHistory
                }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>

</template>

<style scoped>
.el-card {
    width: 88% !important;
    margin: 15px auto;
}

.detail {
    width: 98% !important;
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

.toolbar {
    border-bottom: 1px solid #ccc;
}

.report {
    padding: 40px;
}

.editor {
    min-height: 400px;
    overflow-y: hidden
}
</style>
