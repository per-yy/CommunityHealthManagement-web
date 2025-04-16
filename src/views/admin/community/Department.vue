<script setup>
import { ElMessage } from 'element-plus';
import { ref, onBeforeMount } from 'vue';
import { getDepartmentListService, deleteDepartmentService, addDepartmentService } from '@/api/department';
import { getHospitalService } from '@/api/hospital';
const addDepartmentDialog = ref(false)
const departments = ref({});
const department = ref({})
const hospitals = ref([])
const pageQueryDto = ref({
    pageNum: 1,
    pageSize: 10
})
const getDepartments = async () => {
    let result = await getDepartmentListService(pageQueryDto.value);
    departments.value = result.data;
}
const deleteDepartment = async (id) => {
    await deleteDepartmentService(id);
    await getDepartments();
    ElMessage.success("删除成功")
}
const getHospitals = async () => {
    let result = await getHospitalService();
    hospitals.value = result.data;
}
const addDepartment = async () => {
    await addDepartmentService(department.value);
    await getDepartments();
    addDepartmentDialog.value = false;
    ElMessage.success("添加成功")
}
//换页查询
const pageChange = async (newPage) => {
    pageQueryDto.value.pageNum = newPage;
    await getDepartments();
}
onBeforeMount(async () => {
    await getDepartments();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>科室列表</h4>
            <el-button type="success" @click="addDepartmentDialog = true; getHospitals()">添加科室</el-button>
        </div>
        <el-table :data="departments.items" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="name" label="科室名" />
            <el-table-column prop="hospital" label="所属医院" />
            <el-table-column label="操作" width="80px">
                <template #default="scope">
                    <el-button size="small" link type="danger" @click="deleteDepartment(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;margin-top: 20px;">
            <el-pagination background layout="prev, pager, next" :page-size="pageQueryDto.pageSize"
                :total="departments.total" @current-change="pageChange" />
        </div>
    </el-card>

    <!-- 添加科室-->
    <el-dialog v-model="addDepartmentDialog" title="添加科室" width="420" align-center center>
        <el-form label-width="80px" label-position="left">
            <el-form-item label="名称">
                <el-input v-model="department.name"></el-input>
            </el-form-item>
            <el-form-item label="所属医院">
                <el-select v-model="department.hospitalId" style="width: 360px" placeholder="选择">
                    <el-option v-for="item in hospitals" :key="item.id" :value="item.id" :label="item.name" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addDepartmentDialog = false">取消</el-button>
                <el-button type="primary" @click="addDepartment">
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
.el-pagination {
    margin: 0 auto;
}
</style>
