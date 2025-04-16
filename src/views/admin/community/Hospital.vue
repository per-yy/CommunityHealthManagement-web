<script setup>
import { addHospitalService, deleteHospitalService, getHospitalService } from '@/api/hospital';
import { ElMessage } from 'element-plus';
import { ref, onBeforeMount } from 'vue';
const addHospitalDialog = ref(false)
const hospitals = ref([]);
const hospital = ref({})
const getHospitals = async () => {
    let result = await getHospitalService();
    hospitals.value = result.data;
}
const deleteHospital = async (id) => {
    await deleteHospitalService(id);
    await getHospitals();
    ElMessage.success("删除成功")
}
const addHospital = async () => {
    await addHospitalService(hospital.value);
    await getHospitals();
    addHospitalDialog.value=false;
    ElMessage.success("添加成功")
}
onBeforeMount(async () => {
    await getHospitals();
})
</script>

<template>
    <el-card>
        <div class="option">
            <h4>医院列表</h4>
            <el-button type="success" @click="addHospitalDialog = true;">添加医院</el-button>
        </div>
        <el-table :data="hospitals" border style="width: 100%" stripe>
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="name" label="医院名" />
            <el-table-column label="操作" width="80px">
                <template #default="scope">
                    <el-button size="small" link type="danger" @click="deleteHospital(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 添加医院-->
    <el-dialog v-model="addHospitalDialog" title="添加医院" width="420" align-center center>
        <el-form label-width="50px" label-position="left">
            <el-form-item label="名称">
                <el-input v-model="hospital.name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addHospitalDialog = false">取消</el-button>
                <el-button type="primary" @click="addHospital">
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
</style>
