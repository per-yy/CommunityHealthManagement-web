// 导入 Vue Router 中的 createRouter 和 createWebHistory 函数
import { createRouter, createWebHistory } from 'vue-router';
// 导入页面组件
import Login from '@/views/Login.vue';
import Resident from '@/views/Resident.vue';
import Doctor from '@/views/Doctor.vue';
import Admin from '@/views/Admin.vue';
// 居民端
import ConsultationR from '@/views/resident/Consultation.vue';
import AppointmentR from '@/views/resident/Appointment.vue';
import ActivityR from '@/views/resident/Activity.vue';
import ResidentInfo from '@/views/resident/archives/SelfInfo.vue';
import HealthReport from '@/views/resident/archives/HealthReport.vue';
import MedicalRecord from '@/views/resident/archives/MedicalRecord.vue';
//医生端
import DoctorInfo from '@/views/doctor/SelfInfo.vue';
import DiagnosticRecord from '@/views/doctor/DiagnosticRecord.vue';
import ConsultationD from '@/views/doctor/Consultation.vue';
import AppointmentD from '@/views/doctor/Appointment.vue';
import ActivityD from '@/views/doctor/Activity.vue';
//管理端
import ResidentA from '@/views/admin/user/Resident.vue';
import DoctorA from '@/views/admin/user/Doctor.vue';
import Hospital from '@/views/admin/community/Hospital.vue';
import Department from '@/views/admin/community/Department.vue';
import ActivityA from '@/views/admin/Activity.vue';
import ConsultationA from '@/views/admin/Consultation.vue';
import AppointmentA from '@/views/admin/Appointment.vue';
import MedicalRecordA from '@/views/admin/MedicalRecord.vue';
// 定义路由关系
const staticRoutes = [
    { path: '/login', component: Login },
    {
        path: '/resident', component: Resident, redirect: '/resident/archives/self-info', children: [
            { path: '/resident/archives/self-info', component: ResidentInfo },
            { path: '/resident/archives/Medical-record', component: MedicalRecord },
            { path: '/resident/archives/health-report', component: HealthReport },
            { path: '/resident/consultation', component: ConsultationR },
            { path: '/resident/appointment', component: AppointmentR },
            { path: '/resident/activity', component: ActivityR },
        ]
    },
    {
        path: '/doctor', component: Doctor, redirect: '/doctor/self-info', children: [
            { path: '/doctor/self-info', component: DoctorInfo },
            { path: '/doctor/diagnostic-record', component: DiagnosticRecord },
            { path: '/doctor/consultation', component: ConsultationD },
            { path: '/doctor/appointment', component: AppointmentD },
            { path: '/doctor/activity', component: ActivityD },
        ]
    },
    {
        path: '/admin', component: Admin, redirect: '/admin/user/resident', children: [
            { path: '/admin/user/resident', component: ResidentA },
            { path: '/admin/user/doctor', component: DoctorA },
            { path: '/admin/community/hospital', component: Hospital },
            { path: '/admin/community/department', component: Department },
            { path: '/admin/consultation', component: ConsultationA },
            { path: '/admin/activity', component: ActivityA },
            { path: '/admin/appointment', component: AppointmentA },
            { path: '/admin/medical-record', component: MedicalRecordA },

        ]
    }
];

// 创建路由器
const router = createRouter({
    history: createWebHistory(),  // 使用 HTML5 history 模式的路由，需要服务器配置支持
    routes: staticRoutes                  // 将定义好的路由关系传递给路由器
});

// 动态路由处理
router.beforeEach(async (to) => {
    // 动态导入 Store 避免循环依赖
    const { useTokenStore } = await import('@/stores/token')
    const tokenStore = useTokenStore()

    // 处理根路径重定向 根据已登录的角色重定向
    if (to.path === '/') {
        return tokenStore.role ? `/${tokenStore.role}` : '/login'
    }
})

// 导出路由，以便在其他地方使用
export default router;
