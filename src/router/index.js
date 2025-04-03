// 导入 Vue Router 中的 createRouter 和 createWebHistory 函数
import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Login from '@/views/Login.vue';
import Resident from '@/views/Resident.vue';
import Medical from '@/views/Medical.vue';
import Admin from '@/views/Admin.vue';
import Consultation from '@/views/resident/Consultation.vue';
import Appointment from '@/views/resident/Appointment.vue';
import Activity from '@/views/resident/Activity.vue';
import SelfInfo from '@/views/resident/archives/SelfInfo.vue';
import HealthReport from '@/views/resident/archives/HealthReport.vue';
import MedicalRecord from '@/views/resident/archives/MedicalRecord.vue';
// 定义路由关系
const routes = [
    { path: '/', redirect:'/login' },
    { path: '/login', component: Login },
    {
        path: '/resident', component: Resident, redirect: '/resident/archives/self-info', children: [
            { path: '/resident/archives/self-info', component: SelfInfo },
            { path: '/resident/archives/Medical-record', component: MedicalRecord },
            { path: '/resident/archives/health-report', component: HealthReport },
            { path: '/resident/consultation', component: Consultation },
            { path: '/resident/appointment', component: Appointment },
            { path: '/resident/activity', component: Activity },
        ]
    },
    { path: '/medical', component: Medical },
    { path: '/admin', component: Admin }
];

// 创建路由器
const router = createRouter({
    history: createWebHistory(),  // 使用 HTML5 history 模式的路由，需要服务器配置支持
    routes: routes                 // 将定义好的路由关系传递给路由器
});

// 导出路由，以便在其他地方使用
export default router;
